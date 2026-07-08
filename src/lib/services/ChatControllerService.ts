/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatMessageDto } from '../models/ChatMessageDto';
import type { UserChatDto } from '../models/UserChatDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatControllerService {
    /**
     * @param recipientId
     * @param senderId
     * @returns any OK
     * @throws ApiError
     */
    public static markAsRead(
        recipientId: string,
        senderId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/read/{recipientId}/{senderId}',
            path: {
                'recipientId': recipientId,
                'senderId': senderId,
            },
        });
    }
    /**
     * @param senderId
     * @param recipientId
     * @returns ChatMessageDto OK
     * @throws ApiError
     */
    public static findChatMessages(
        senderId: string,
        recipientId: string,
    ): CancelablePromise<Array<ChatMessageDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/messages/{senderId}/{recipientId}',
            path: {
                'senderId': senderId,
                'recipientId': recipientId,
            },
        });
    }
    /**
     * @param userId
     * @returns UserChatDto OK
     * @throws ApiError
     */
    public static getSuggestions1(
        userId: string,
    ): CancelablePromise<Array<UserChatDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/suggestions/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * @param q
     * @returns UserChatDto OK
     * @throws ApiError
     */
    public static searchUsers(
        q: string,
    ): CancelablePromise<Array<UserChatDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/search',
            query: {
                'q': q,
            },
        });
    }
    /**
     * @param userId
     * @returns UserChatDto OK
     * @throws ApiError
     */
    public static getContacts(
        userId: string,
    ): CancelablePromise<Array<UserChatDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/contacts/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
}
