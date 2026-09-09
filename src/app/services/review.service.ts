import {
  Injectable
} from '@angular/core';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';

import {
  firebaseAuth,
  firestore
} from './firebase';



export interface ProductReview {

  id?: string;

  productId: number;

  userId: string;

  userName: string;

  rating: number;

  comment: string;

  orderId?: string;

  createdAt?: any;

  updatedAt?: any;

}



@Injectable({
  providedIn: 'root'
})
export class ReviewService {



  /* =========================
     REQUIRE USER
     ========================= */

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
     ADD REVIEW
     ========================= */

  async addReview(
    productId: number,
    rating: number,
    comment: string,
    userName: string,
    orderId?: string
  ): Promise<void> {


    const user =
      this.requireUser();


    if (
      !Number.isFinite(rating)
      ||
      rating < 1
      ||
      rating > 5
    ) {

      throw new Error(
        'Rating must be between 1 and 5.'
      );

    }


    const cleanComment =
      String(
        comment || ''
      ).trim();


    if (
      cleanComment.length < 3
    ) {

      throw new Error(
        'Please write a short review.'
      );

    }


    /*
     * Prevent duplicate review
     */

    const existingReview =
      await this.getMyReview(
        productId
      );


    if (existingReview) {

      throw new Error(
        'You already reviewed this product.'
      );

    }


    await addDoc(
      collection(
        firestore,
        'reviews'
      ),
      {

        productId,

        userId:
          user.uid,

        userName:
          String(
            userName || ''
          ).trim()
          ||
          user.displayName
          ||
          'SmileHub Customer',

        rating,

        comment:
          cleanComment,

        orderId:
          orderId || '',

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp()

      }
    );

  }



  /* =========================
     GET PRODUCT REVIEWS
     ========================= */

  async getProductReviews(
    productId: number
  ): Promise<ProductReview[]> {


    const reviewsQuery =
      query(

        collection(
          firestore,
          'reviews'
        ),

        where(
          'productId',
          '==',
          productId
        ),

        orderBy(
          'createdAt',
          'desc'
        )

      );


    const snapshot =
      await getDocs(
        reviewsQuery
      );


    return snapshot.docs.map(
      reviewDoc => {


        const data =
          reviewDoc.data();


        return {

          id:
            reviewDoc.id,

          productId:
            Number(
              data['productId'] ?? 0
            ),

          userId:
            String(
              data['userId'] ?? ''
            ),

          userName:
            String(
              data['userName']
              ??
              'SmileHub Customer'
            ),

          rating:
            Number(
              data['rating'] ?? 0
            ),

          comment:
            String(
              data['comment'] ?? ''
            ),

          orderId:
            String(
              data['orderId'] ?? ''
            ),

          createdAt:
            data['createdAt'],

          updatedAt:
            data['updatedAt']

        };


      }
    );

  }



  /* =========================
     GET MY REVIEW
     ========================= */

  async getMyReview(
    productId: number
  ): Promise<ProductReview | null> {


    const user =
      firebaseAuth.currentUser;


    if (!user) {

      return null;

    }


    const reviews =
      await this.getProductReviews(
        productId
      );


    const review =
      reviews.find(
        item =>
          item.userId ===
          user.uid
      );


    return (
      review ?? null
    );

  }



  /* =========================
     UPDATE REVIEW
     ========================= */

  async updateReview(
    reviewId: string,
    rating: number,
    comment: string
  ): Promise<void> {


    this.requireUser();


    const cleanReviewId =
      String(
        reviewId || ''
      ).trim();


    if (!cleanReviewId) {

      throw new Error(
        'Review not found.'
      );

    }


    if (
      !Number.isFinite(rating)
      ||
      rating < 1
      ||
      rating > 5
    ) {

      throw new Error(
        'Rating must be between 1 and 5.'
      );

    }


    const cleanComment =
      String(
        comment || ''
      ).trim();


    if (
      cleanComment.length < 3
    ) {

      throw new Error(
        'Please write a short review.'
      );

    }


    await updateDoc(
      doc(
        firestore,
        'reviews',
        cleanReviewId
      ),
      {

        rating,

        comment:
          cleanComment,

        updatedAt:
          serverTimestamp()

      }
    );

  }



  /* =========================
     DELETE REVIEW
     ========================= */

  async deleteReview(
    reviewId: string
  ): Promise<void> {


    this.requireUser();


    const cleanReviewId =
      String(
        reviewId || ''
      ).trim();


    if (!cleanReviewId) {

      throw new Error(
        'Review not found.'
      );

    }


    await deleteDoc(
      doc(
        firestore,
        'reviews',
        cleanReviewId
      )
    );

  }



  /* =========================
     REVIEW SUMMARY
     ========================= */

  async getReviewSummary(
    productId: number
  ): Promise<{
    average: number;
    count: number;
  }> {


    const reviews =
      await this.getProductReviews(
        productId
      );


    if (
      reviews.length === 0
    ) {

      return {

        average: 0,

        count: 0

      };

    }


    const total =
      reviews.reduce(
        (
          sum,
          review
        ) => {

          return (
            sum
            +
            Number(
              review.rating || 0
            )
          );

        },
        0
      );


    return {

      average:
        total /
        reviews.length,

      count:
        reviews.length

    };

  }


}