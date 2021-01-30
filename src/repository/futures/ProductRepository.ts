import {ValidatorUtils} from '../../utils/ValidatorUtils';
import {FuturesDbManager} from '../FuturesDbManager';
import {Product} from '../../entity/futures/Product';

/**
 *
 *@since
 *@author
 *@date 2020/10/9 16:28
 */
export class ProductRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): ProductRepository {
        if (ProductRepository.repository == null) {
            ProductRepository.repository = new ProductRepository();
        }
        return ProductRepository.repository;
    }

    /**
     * 根据id获取品种
     */
    async get(id) {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(Product)
            .createQueryBuilder()
            .select('*');
        if (ValidatorUtils.isNotEmpty(id)) {
            queryBuilder.andWhere('id = :id', {id: id});
        }
        const result = await queryBuilder.getRawMany();
        return {
            result: result
        }
    }

    /**
     * 品种列表
     */
    async listAll() {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(Product)
            .createQueryBuilder()
            .select('product_id')
            .addSelect('product_name')

        const result = await queryBuilder.getRawMany();

        return {
            result: result
        }
    }


    /**
     * 根据品种名称查询品种
     */
    async listProduct(productName) {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(Product)
            .createQueryBuilder()
            .select('product_id')
            .addSelect('product_name')

        if (ValidatorUtils.isNotEmpty(productName)) {
            queryBuilder.andWhere('product_name = :productName', {productName: productName});
        }

        const result = await queryBuilder.getRawMany();

        return {
            result: result
        }
    }


}
