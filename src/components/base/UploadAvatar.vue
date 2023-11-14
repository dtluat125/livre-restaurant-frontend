<template>
    <div class="form-group position-relative" :class="{ 'flex-column': !isHorizontal }">
        <el-upload
            :drag="false"
            class="avatar-uploader"
            :accept="acceptFileType"
            :before-upload="onBeforeUpload"
            :on-error="UploadError"
            :on-preview="handlePreview"
            :on-success="handleSuccess"
            auto-upload="false"
            :http-request="handleFileUpload"
            :file-list="fileList"
            :show-file-list="false"
            @mouseover="onHover"
            @mouseleave="onLeave"
        >
            <img :src="imageUrl" class="avatar" :class="hover ? 'avatar-hover' : ''" />
            <img
                :src="editIcon"
                class="hover-img"
                :class="hover ? 'hover-img-hover' : ''"
            />
        </el-upload>
        <div
            v-if="error"
            class="invalid-feedback text-start"
            :class="{ 'd-block': error }"
        >
            <span>{{ error }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Prop, Vue, Watch } from 'vue-property-decorator';
import { IFormatFile, IUploadSuccess } from '@common/types';
import i18n from '@/plugins/vue-i18n';
import { IMAGE_ACCEPTED_FILE_TYPES, MAX_SIZE_FILE } from '@common/constants';
import { fileService, uploadFileToS3 } from '@common/services/file.service';
import { ElLoading } from 'element-plus';
type VFile = Vue & { file: File };
export default class UploadAvatar extends Vue {
    @Prop({ default: IMAGE_ACCEPTED_FILE_TYPES.join(',') })
    readonly acceptFileType!: string;

    @Prop({ default: '' }) readonly path!: string;
    @Prop({ default: false }) currentImageURL!: string;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: false }) readonly reset!: boolean;
    @Prop({
        default: () => {
            return [];
        },
    })
    @Prop({ default: MAX_SIZE_FILE })
    maxSizeFile!: number;

    hover = false;

    value!: IFormatFile[];

    get fileList(): IFormatFile[] {
        return this.value;
    }

    set fileList(value: IFormatFile[]) {
        this.$emit('input', value);
    }

    get imageUrl(): string {
        return this.currentImageURL
            ? this.currentImageURL
            : require('@/assets/icons/avatar-default.png');
    }

    error = '';
    get editIcon(): string {
        return require('@/assets/icons/btn.edit.svg');
    }

    @Watch('reset')
    onReset(): void {
        if (!this.reset) {
            this.error = '';
        }
    }

    onHover(): void {
        this.hover = true;
    }

    onLeave(): void {
        this.hover = false;
    }

    onBeforeUpload(file: File): boolean {
        const arr = this.acceptFileType.split(',');
        if (arr.indexOf(file.type) === -1) {
            this.error = i18n.global.t('common.common.uploadFile.fileType') as string;
            return false;
        }
        const isLt1M = file.size / 1024 / 1024 < 2;
        if (!isLt1M) {
            this.error = i18n.global.t('common.common.uploadFile.rules.tooBig') as string;
            return false;
        }
        this.error = '';
        return isLt1M;
    }

    handleSuccess(response: IUploadSuccess): void {
        this.$emit('set-avatar-url', response.url);
    }

    async handleFileUpload(files: VFile): Promise<unknown> {
        const loading = ElLoading.service({
            target: '.avatar-uploader',
        });
        const { file } = files;
        const data = await fileService.getPreSignedUrl(this.path, file.name);

        const { path, fileName, presignedUrl } = data.data;
        const uploadToS3Response = await uploadFileToS3(file, presignedUrl);
        if (!uploadToS3Response?.success) {
            return uploadToS3Response;
        }
        const lastDot = file.name.lastIndexOf('.');
        const registerFileResponse = await fileService.registerFile({
            path,
            originalName: file.name,
            fileName,
            size: file.size,
            extension: file.name.substr(lastDot + 1),
            mimetype: file.type,
        });
        if (!registerFileResponse?.success) {
            return {
                ...registerFileResponse,
            };
        }
        this.$emit('set-avatar-id', registerFileResponse?.data?.id);
        loading.close();
        return {
            success: true,
            fileName,
            url: registerFileResponse?.data?.url,
        };
    }
}
</script>

<style scoped lang="scss">
.upload-file {
    display: inline-block;
}

.text-start {
    text-align: center !important;
}
.avatar {
    object-fit: cover;
    border-radius: 50%;
    height: 150px;
    width: 150px;
    opacity: 1;
}
.avatar-hover {
    opacity: 0.5;
}
.hover-img {
    border-radius: 50%;
    object-fit: cover;
    height: 150px;
    width: 150px;
    transition: 0.5s ease;
    opacity: 0;
    position: absolute;
    margin-right: -300px;
    transform: translate(-100%, -0%);
    -ms-transform: translate(-50%, -50%);
    text-align: center;
    opacity: 0;
}
.hover-img-hover {
    opacity: 1;
}

.form-group label {
    text-align: initial;
    width: 100%;
    font-weight: bold;
    margin-bottom: 6px;
}
.mark-required {
    color: red;
}
.w-30 {
    width: 30%;
}
.w-70 {
    width: 70%;
}
.avatar-uploader {
    position: relative;
}
@media screen and (max-width: 1150px) {
    .form-group {
        flex-direction: column;
    }
}
</style>
