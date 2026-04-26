//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { PostsSortBy } from './posts-sort-by';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetPostsQueryParams extends BaseQueryParams {
  sortBy = PostsSortBy.CreatedAt;
  // searchNameTerm: string | null = null;
}
