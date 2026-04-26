//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { CommentsSortBy } from './comments-sort-by';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetCommentsQueryParams extends BaseQueryParams {
  sortBy = CommentsSortBy.CreatedAt;
  // searchNameTerm: string | null = null;
}
