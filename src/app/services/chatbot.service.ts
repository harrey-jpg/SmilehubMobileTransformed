import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatDisplayMode =
  'products'
  |
  'compare';

export type ChatbotCartActionType =
  'add'
  |
  'set'
  |
  'remove'
  |
  'clear';

export interface ChatbotCartAction {
  action: ChatbotCartActionType;
  productId?: number | string;
  quantity?: number;
}

export interface ChatbotResponse {
  reply: string;
  productIds: Array<number | string>;
  displayMode: ChatDisplayMode;
  cartAction: ChatbotCartAction | null;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private readonly apiUrl =
    'http://localhost:3000/api/chat';

  constructor(
    private http: HttpClient
  ) {}

  async sendMessage(
    message: string,
    context: any = {},
    history: ChatMessage[] = []
  ): Promise<ChatbotResponse> {

    const cleanMessage =
      String(
        message || ''
      )
        .trim();

    if (!cleanMessage) {
      throw new Error(
        'Please enter a message.'
      );
    }

    const response =
      await firstValueFrom(
        this.http.post<ChatbotResponse>(
          this.apiUrl,
          {
            message:
              cleanMessage,
            context,
            history
          }
        )
      );

    const reply =
      String(
        response?.reply || ''
      )
        .trim();

    if (!reply) {
      throw new Error(
        'The AI assistant did not return a response.'
      );
    }

    const displayMode:
      ChatDisplayMode =
      response?.displayMode ===
        'compare'
        ? 'compare'
        : 'products';

    let cartAction:
      ChatbotCartAction | null =
      null;

    if (
      response?.cartAction
      &&
      typeof response.cartAction ===
        'object'
    ) {

      const rawAction =
        String(
          response.cartAction.action ||
          'add'
        )
          .toLowerCase();

      const action:
        ChatbotCartActionType =
        rawAction === 'set'
          ? 'set'
          : rawAction === 'remove'
            ? 'remove'
            : rawAction === 'clear'
              ? 'clear'
              : 'add';

      if (action === 'clear') {
        cartAction = {
          action: 'clear'
        };
      } else if (
        response.cartAction.productId !==
          undefined
        &&
        response.cartAction.productId !==
          null
      ) {

        const rawQuantity =
          Number(
            response.cartAction.quantity ??
            1
          );

        const maxQuantity = 20;

        const quantity =
          Number.isFinite(rawQuantity)
            ? Math.max(
                action === 'set'
                  ? 0
                  : 1,
                Math.min(
                  maxQuantity,
                  Math.floor(rawQuantity)
                )
              )
            : 1;

        cartAction = {
          action,
          productId:
            response.cartAction.productId,
          quantity
        };
      }
    }

    return {
      reply,
      productIds:
        Array.isArray(
          response?.productIds
        )
          ? response.productIds
          : [],
      displayMode,
      cartAction
    };
  }
}
