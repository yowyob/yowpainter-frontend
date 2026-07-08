export type ActuCreateRequest = {
    title?: string;
    comment?: string;
    imageUrl?: string;
    videoUrl?: string;
    mediaType?: ActuCreateRequest.mediaType;
};

export namespace ActuCreateRequest {
    export enum mediaType {
        IMAGE = 'IMAGE',
        VIDEO = 'VIDEO',
    }
}
