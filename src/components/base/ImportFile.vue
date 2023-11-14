<template>
    <el-dialog
        width="500px"
        lock-scroll
        v-model="isShow"
        @open="onOpen"
        @closed="closePopup"
    >
        <template #title>
            <h3 class="text-start">
                {{ title }}
            </h3>
        </template>
        <div class="container-btn">
            <div class="file-upload-input">
                <label class="label-file" for="file"> {{ fileNameUpload }}</label>
                <input
                    type="file"
                    ref="file"
                    :accept="acceptFileTypes"
                    @change="selectFile($event)"
                    class="custom-file-input"
                />
                <button>+</button>
            </div>
        </div>
        <div class="d-flex justify-content-end">
            <el-link @click="handleDownload" :underline="false" type="primary"
                ><u> {{ $t('common.common.uploadFile.template') }}</u></el-link
            >
        </div>
        <div
            v-if="error"
            class="invalid-feedback upload-error"
            :class="{ 'd-block': error }"
        >
            <span>{{ error }}</span>
        </div>
        <div class="btn-upload d-flex justify-content-center">
            <el-button @click="closePopup">
                {{ $t('common.app.buttons.cancel') }}
            </el-button>
            <el-button :disabled="error !== ''" type="primary" @click="handleSaveData">
                {{ $t('common.common.uploadFile.upload') }}
            </el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import get from 'lodash/get';
import { Prop } from 'vue-property-decorator';
import { Download as DownloadIcon } from '@element-plus/icons-vue';
import { EXCEL_ACCEPTED_FILE_TYPES } from '@/common/constants';
@Options({
    components: { DownloadIcon },
})
export default class ImportFile extends Vue {
    @Prop({ default: false }) isShowUploadForm!: boolean;
    @Prop({ default: '' }) readonly title!: string;
    @Prop({ default: '' }) error!: string;
    @Prop({ default: EXCEL_ACCEPTED_FILE_TYPES.join(',') })
    readonly acceptFileTypes!: string;

    file?: File;
    fileNameUpload = '' as string;

    get isShow(): boolean {
        return this.isShowUploadForm;
    }

    declare $refs: { uploader: HTMLInputElement; file: HTMLFormElement };

    selectFile(event: Event): void {
        const target = event.target;
        const file = get(target, 'files[0]', '') as File;
        const reader = new FileReader();
        if (file?.size) {
            reader.readAsDataURL(file);
            this.fileNameUpload = file?.name;
            this.$emit('changeFile', file);
            this.file = file;
        }
    }

    async handleSaveData(): Promise<void> {
        const formData = new FormData();
        formData.append('file', this.file as File);
        this.$emit('handleSave', this.file);
    }

    handleDownload(): void {
        this.$emit('download');
    }

    onOpen(): void {
        this.$emit('open');
    }

    closePopup(): void {
        this.$refs.file.value = null;
        this.file = undefined;
        this.fileNameUpload = '';
        this.$emit('resetUpload');
    }
}
</script>

<style lang="scss" scoped>
.container-btn {
    background: white;
    margin-left: 15px;
}
.file-upload-input {
    display: grid;
    margin-bottom: 5px;
    grid-gap: 10px;
    position: relative;
    z-index: map-get($map: $zIndex, $key: fileUploadInput);
}
.custom-file-input {
    &:hover {
        cursor: pointer;
    }
}
.file-upload-input label {
    display: flex;
    align-items: center;
    color: setColor(primary, 0.5);
    background: setColor(white);
    transition: 0.4s ease;
    font-family: arial, sans-serif;
    font-size: 0.75em;
    font-weight: regular;
}

.file-upload-input input {
    position: relative;
    z-index: map-get($map: $zIndex, $key: fileUploadInput);
    padding: 0 gap(m);
    width: 100%;
    height: 50px;
    border: 1px solid #b1c0f3;
    border-radius: 8px;
    font-family: arial, sans-serif;
    font-size: 1rem;
    font-weight: regular;
}
.file-upload-input input[type='file'] {
    padding: 0 gap(m);
    color: transparent;
}
.file-upload-input input[type='file']::-webkit-file-upload-button {
    visibility: hidden;
    margin-left: 10px;
    padding: 0;
    height: 50px;
    width: 0;
}

.file-upload-input button {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50px;
    height: 50px;
    line-height: 0;
    user-select: none;
    color: white;
    background-color: #3c61e0;
    border-radius: 0 8px 8px 0;
    border: 1px solid #b1c0f3;
    font-family: arial, sans-serif;
    font-size: 25px;
    font-weight: 800;
}
.btn-upload {
    margin-top: 30px;
}
label {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 0 0 15px;
}
.label-file {
    font-size: 14px !important;
}
.upload-error {
    text-align: left !important;
    padding-left: 15px;
}

u {
    padding-bottom: 1px;
    text-decoration: none;
    border-bottom: 1px solid var(--el-color-primary);
}
</style>
