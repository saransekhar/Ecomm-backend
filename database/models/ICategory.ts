export interface ICategory {
    _id?: string;
    name: string;
    description: string;
    subCategories: ISubCategory[],
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISubCategory {
    _id?: string;
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}
