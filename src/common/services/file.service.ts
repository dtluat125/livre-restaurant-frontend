import axiosOrigin from 'axios';
import axios from '@/plugins/axios';
import {
    IBodyResponse,
    IFormatFile,
    IGetPreSignedUrlResponse,
    IRegisterFileParams,
    IRegisterFileResponse,
    IUploadFileToS3Response,
} from '../types';
import { HttpStatus } from '../constants';
import { trimObject } from '@/utils/helper';

class FileService {
    async getPreSignedUrl(
        path: string,
        originalName: string,
    ): Promise<IBodyResponse<IGetPreSignedUrlResponse>> {
        return await axios.get('/file/presigned-url', {
            params: {
                path,
                originalName,
            },
        });
    }

    async uploadFileToS3(
        file: File,
        presignedUrl: string,
    ): Promise<IUploadFileToS3Response> {
        await axiosOrigin.put(presignedUrl, file, {
            headers: {
                'x-amz-acl': 'public-read',
                'Content-Type': file.type,
            },
        });
        return { success: true };
    }

    async registerFile(
        params: IRegisterFileParams,
    ): Promise<IBodyResponse<IRegisterFileResponse>> {
        trimObject(params);
        return await axios.post('/file', params);
    }

    async getFileDetail(id: number): Promise<IBodyResponse<IRegisterFileResponse>> {
        return await axios.get(`/file/${id}`);
    }
}

export const fileService = new FileService();

export async function uploadFile(
    filePath: string,
    fileItem: IFormatFile,
): Promise<IUploadFileToS3Response> {
    const getS3PreSignedUrlResponse = await fileService.getPreSignedUrl(
        filePath,
        fileItem.originalName,
    );
    if (!getS3PreSignedUrlResponse.success)
        return {
            success: getS3PreSignedUrlResponse.success,
        };

    const { path, originalName, fileName, presignedUrl } = getS3PreSignedUrlResponse.data;

    const uploadToS3Response = await fileService.uploadFileToS3(
        fileItem.file,
        presignedUrl,
    );

    if (!uploadToS3Response.success) {
        return {
            success: uploadToS3Response.success,
        };
    }

    const registerFileResponse = await fileService.registerFile({
        path,
        fileName,
        originalName,
        extension: fileItem.extension,
        mimetype: fileItem.mimetype,
        size: fileItem.size,
    });

    if (!registerFileResponse.success) {
        return {
            success: registerFileResponse.success,
        };
    }

    return {
        success: true,
        id: registerFileResponse.data.id,
        url: registerFileResponse.data.url,
    };
}

export async function uploadFileToS3(
    file: File,
    presignedUrl: string,
): Promise<IUploadFileToS3Response> {
    try {
        await axiosOrigin.put(presignedUrl, file, {
            headers: {
                'x-amz-acl': 'public-read',
                'Content-Type': file.type,
            },
        });
        return {
            success: true,
            code: HttpStatus.OK,
        };
    } catch (error) {
        return {
            success: false,
            code: HttpStatus.INTERNAL_SERVER_ERROR,
        };
    }
}
