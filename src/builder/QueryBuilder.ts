class QueryBuilder<T> {
  public model: any;
  public query: Record<string, any>;
  public prismaQuery: any; 

  constructor(model: any, query: Record<string, any>) {
    this.model = model;
    this.query = query;
    this.prismaQuery = {
      where: {}, 
    };
  }


  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm;
    if (searchTerm) {
      this.prismaQuery.where = {
        ...this.prismaQuery.where,
        OR: searchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
      };
    }
    return this;
  }


  filter() {
    const queryObj = { ...this.query };
    const excludeFields = [
      "searchTerm",
      "sort",
      "limit",
      "page",
      "fields",
      "sortOrder",
    ];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (Object.keys(queryObj).length > 0) {
      this.prismaQuery.where = {
        ...this.prismaQuery.where,
        ...queryObj,
      };
    }
    return this;
  }


  sort() {
    const sort = (this.query?.sort as string) || "createdAt";
    const sortOrder = (this.query?.sortOrder as string) || "desc";

    this.prismaQuery.orderBy = {
      [sort]: sortOrder,
    };
    return this;
  }


  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.prismaQuery.skip = skip;
    this.prismaQuery.take = limit;

    return this;
  }

  async execute() {
    const data = await this.model.findMany({
      where: this.prismaQuery.where, 
      orderBy: this.prismaQuery.orderBy,
      skip: this.prismaQuery.skip,
      take: this.prismaQuery.take,
      include: this.query.include,
    });

    const total = await this.model.count({
      where: this.prismaQuery.where,
    });

    return {
      data,
      meta: {
        page: Number(this.query?.page) || 1,
        limit: Number(this.query?.limit) || 10,
        total,
      },
    };
  }
}

export default QueryBuilder;
