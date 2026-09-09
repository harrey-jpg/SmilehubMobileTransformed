import {
  Injectable
} from '@angular/core';

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

import {
  firebaseAuth,
  firestore
} from './firebase';


@Injectable({
  providedIn: 'root'
})
export class ProfilePhotoService {


  private requireUser() {


    const user =
      firebaseAuth.currentUser;


    if (!user) {


      throw new Error(
        'You must log in first.'
      );


    }


    return user;


  }



  /* =========================
     LOAD PROFILE PHOTO
     ========================= */

  async loadProfilePhoto():
    Promise<string> {


    const user =
      this.requireUser();


    const snapshot =
      await getDoc(

        doc(
          firestore,
          'users',
          user.uid
        )

      );


    if (
      snapshot.exists()
    ) {


      const data =
        snapshot.data();


      if (
        Boolean(
          data['photoRemoved']
        )
      ) {


        return '';


      }


      const customPhoto =
        String(
          data['photoDataUrl'] || ''
        )
          .trim();


      if (
        customPhoto
      ) {


        return customPhoto;


      }


      const storedPhoto =
        String(
          data['photoURL'] || ''
        )
          .trim();


      if (
        storedPhoto
      ) {


        return storedPhoto;


      }


    }


    return String(
      user.photoURL || ''
    )
      .trim();


  }



  /* =========================
     SAVE PROFILE PHOTO
     ========================= */

  async saveProfilePhoto(
    dataUrl: string
  ):
    Promise<void> {


    const user =
      this.requireUser();


    const cleanPhoto =
      String(
        dataUrl || ''
      )
        .trim();


    if (
      !cleanPhoto.startsWith(
        'data:image/'
      )
    ) {


      throw new Error(
        'Invalid profile image.'
      );


    }


    /*
     * Keep the Firestore document comfortably
     * below its size limit.
     */

    if (
      cleanPhoto.length >
      300000
    ) {


      throw new Error(
        'The profile image is still too large. Please choose another photo.'
      );


    }


    await setDoc(

      doc(
        firestore,
        'users',
        user.uid
      ),

      {

        photoDataUrl:
          cleanPhoto,

        photoRemoved:
          false,

        updatedAt:
          serverTimestamp()

      },

      {
        merge: true
      }

    );


  }



  /* =========================
     REMOVE PROFILE PHOTO
     ========================= */

  async removeProfilePhoto():
    Promise<void> {


    const user =
      this.requireUser();


    await setDoc(

      doc(
        firestore,
        'users',
        user.uid
      ),

      {

        photoDataUrl:
          '',

        /*
         * This prevents a Google profile image
         * from immediately reappearing after
         * the customer chooses Remove Photo.
         */

        photoRemoved:
          true,

        updatedAt:
          serverTimestamp()

      },

      {
        merge: true
      }

    );


  }



  /* =========================
     PREPARE / COMPRESS IMAGE
     ========================= */

  async prepareProfileImage(
    file: File
  ):
    Promise<string> {


    if (
      !file
      ||
      !String(
        file.type || ''
      ).startsWith(
        'image/'
      )
    ) {


      throw new Error(
        'Please select a valid image file.'
      );


    }


    if (
      file.size >
      10 * 1024 * 1024
    ) {


      throw new Error(
        'Please choose an image smaller than 10 MB.'
      );


    }


    const source =
      await this.readFileAsDataUrl(
        file
      );


    const image =
      await this.loadImage(
        source
      );


    const canvas =
      document.createElement(
        'canvas'
      );


    const targetSize =
      256;


    canvas.width =
      targetSize;

    canvas.height =
      targetSize;


    const context =
      canvas.getContext(
        '2d'
      );


    if (
      !context
    ) {


      throw new Error(
        'Unable to process this image.'
      );


    }


    const sourceWidth =
      image.naturalWidth
      ||
      image.width;


    const sourceHeight =
      image.naturalHeight
      ||
      image.height;


    if (
      sourceWidth <= 0
      ||
      sourceHeight <= 0
    ) {


      throw new Error(
        'Unable to read this image.'
      );


    }


    /*
     * Center crop to a square.
     */

    const cropSize =
      Math.min(
        sourceWidth,
        sourceHeight
      );


    const sourceX =
      Math.max(
        0,
        (
          sourceWidth -
          cropSize
        )
        / 2
      );


    const sourceY =
      Math.max(
        0,
        (
          sourceHeight -
          cropSize
        )
        / 2
      );


    context.drawImage(

      image,

      sourceX,
      sourceY,

      cropSize,
      cropSize,

      0,
      0,

      targetSize,
      targetSize

    );


    let quality =
      0.82;


    let output =
      canvas.toDataURL(
        'image/jpeg',
        quality
      );


    /*
     * Reduce quality only when necessary.
     */

    while (
      output.length >
        220000
      &&
      quality >
        0.50
    ) {


      quality -=
        0.08;


      output =
        canvas.toDataURL(
          'image/jpeg',
          quality
        );


    }


    if (
      output.length >
      300000
    ) {


      throw new Error(
        'The selected image is too large after compression.'
      );


    }


    return output;


  }



  /* =========================
     FILE → DATA URL
     ========================= */

  private readFileAsDataUrl(
    file: File
  ):
    Promise<string> {


    return new Promise(
      (
        resolve,
        reject
      ) => {


        const reader =
          new FileReader();


        reader.onload =
          () => {


            resolve(
              String(
                reader.result || ''
              )
            );


          };


        reader.onerror =
          () => {


            reject(
              new Error(
                'Unable to read the selected image.'
              )
            );


          };


        reader.readAsDataURL(
          file
        );


      }
    );


  }



  /* =========================
     LOAD BROWSER IMAGE
     ========================= */

  private loadImage(
    source: string
  ):
    Promise<HTMLImageElement> {


    return new Promise(
      (
        resolve,
        reject
      ) => {


        const image =
          new Image();


        image.onload =
          () => {


            resolve(
              image
            );


          };


        image.onerror =
          () => {


            reject(
              new Error(
                'Unable to process the selected image.'
              )
            );


          };


        image.src =
          source;


      }
    );


  }


}
