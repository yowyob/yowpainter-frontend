export type ActuResponse = {
    id?: string;
    artistId?: string;
    title?: string;
    comment?: string;
    imageUrl?: string;
    videoUrl?: string;
    mediaType?: ActuResponse.mediaType;
    publishedAt?: string;
    createdAt?: string;
};

export namespace ActuResponse {
    export enum mediaType {
        IMAGE = 'IMAGE',
        VIDEO = 'VIDEO',
    }
}
