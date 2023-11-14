import { IQueryString } from '@/common/types';
import { IAvatar } from '../user/types';

export interface ICategory {
    id: number;
    name: string;
    priority: number;
    note: string;
}

export interface ICategoryCreateBody {
    name: string | undefined;
    priority: number | undefined;
    note: string | undefined;
}

export interface ICategoryUpdateBody extends ICategoryCreateBody {
    id: number | undefined;
}

export interface IFood {
    id: number;
    foodName: string;
    price: number;
    foodImgId?: number;
    foodImg?: IAvatar | null;
    categoryId?: number;
}

export interface IFoodCreateBody {
    foodName: string | undefined;
    price: number | undefined;
    foodImgId?: number | undefined;
    categoryId?: number | undefined;
}

export interface IFoodUpdateBody extends IFoodCreateBody {
    id: number | undefined;
}

export interface IQueryStringFood extends IQueryString {
    keyword?: string | null;
    categories?: number[] | null;
}

export interface IQueryStringCategory extends IQueryString {
    keyword?: string | null;
}

export type TModalType = 'Create' | 'Edit' | 'Close';

export interface ITextItem {
    name: string;
    number: number;
}
