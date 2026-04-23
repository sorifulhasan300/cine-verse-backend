import { prisma } from "../../lib/prisma";

const adminStatics = async () => {
  // User statistics
  const totalUsers = await prisma.user.count();
  const usersByRole = await prisma.user.groupBy({
    by: ['role'],
    _count: { role: true },
  });
  const usersByStatus = await prisma.user.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  // Movie statistics
  const totalMovies = await prisma.movie.count();
  const moviesByPricing = await prisma.movie.groupBy({
    by: ['pricing'],
    _count: { pricing: true },
  });

  // Get movies by category (many-to-many relationship)
  const categoryStats = await prisma.category.findMany({
    include: {
      _count: {
        select: { movies: true }
      }
    }
  });

  // Review statistics
  const totalReviews = await prisma.review.count();
  const averageRating = await prisma.review.aggregate({
    _avg: { rating: true },
  });
  const reviewsByStatus = await prisma.review.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  // Subscription statistics
  const totalSubscriptions = await prisma.subscription.count();
  const subscriptionsByPlan = await prisma.subscription.groupBy({
    by: ['plan'],
    _count: { plan: true },
  });
  const subscriptionsByStatus = await prisma.subscription.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  return {
    users: {
      total: totalUsers,
      byRole: {
        labels: usersByRole.map(item => item.role),
        data: usersByRole.map(item => item._count.role),
        chartData: usersByRole.map(item => ({
          label: item.role,
          value: item._count.role,
        })),
      },
      byStatus: {
        labels: usersByStatus.map(item => item.status),
        data: usersByStatus.map(item => item._count.status),
        chartData: usersByStatus.map(item => ({
          label: item.status,
          value: item._count.status,
        })),
      },
    },
    movies: {
      total: totalMovies,
      byPricing: {
        labels: moviesByPricing.map(item => item.pricing),
        data: moviesByPricing.map(item => item._count.pricing),
        chartData: moviesByPricing.map(item => ({
          label: item.pricing,
          value: item._count.pricing,
        })),
      },
      byCategory: {
        labels: categoryStats.map(item => item.name),
        data: categoryStats.map(item => item._count.movies),
        chartData: categoryStats.map(item => ({
          label: item.name,
          value: item._count.movies,
        })),
      },
    },
    reviews: {
      total: totalReviews,
      averageRating: averageRating._avg.rating || 0,
      byStatus: {
        labels: reviewsByStatus.map(item => item.status),
        data: reviewsByStatus.map(item => item._count.status),
        chartData: reviewsByStatus.map(item => ({
          label: item.status,
          value: item._count.status,
        })),
      },
    },
    subscriptions: {
      total: totalSubscriptions,
      byPlan: {
        labels: subscriptionsByPlan.map(item => item.plan),
        data: subscriptionsByPlan.map(item => item._count.plan),
        chartData: subscriptionsByPlan.map(item => ({
          label: item.plan,
          value: item._count.plan,
        })),
      },
      byStatus: {
        labels: subscriptionsByStatus.map(item => item.status),
        data: subscriptionsByStatus.map(item => item._count.status),
        chartData: subscriptionsByStatus.map(item => ({
          label: item.status,
          value: item._count.status,
        })),
      },
    },
  };
};

const userStatics = async (userId: string) => {
  // User's personal statistics
  const watchListCount = await prisma.watchList.count({
    where: { userId },
  });

  const likesCount = await prisma.like.count({
    where: { userId },
  });

  const reviewsCount = await prisma.review.count({
    where: { userId },
  });

  const commentsCount = await prisma.comment.count({
    where: { userId },
  });

  // User's subscription info
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  // User's activity over time (reviews created per month)
  const reviewsByMonth = await prisma.$queryRaw`
    SELECT
      DATE_TRUNC('month', "createdAt") as month,
      COUNT(*) as count
    FROM reviews
    WHERE "userId" = ${userId}
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY month DESC
    LIMIT 12
  `;

  return {
    personalStats: {
      raw: {
        watchList: watchListCount,
        likes: likesCount,
        reviews: reviewsCount,
        comments: commentsCount,
      },
      barChart: {
        labels: ['Watchlist', 'Likes', 'Reviews', 'Comments'],
        data: [watchListCount, likesCount, reviewsCount, commentsCount],
        chartData: [
          { label: 'Watchlist', value: watchListCount },
          { label: 'Likes', value: likesCount },
          { label: 'Reviews', value: reviewsCount },
          { label: 'Comments', value: commentsCount },
        ],
      },
    },
    subscription: subscription ? {
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
    } : null,
    activity: {
      reviewsByMonth: {
        labels: (reviewsByMonth as any[]).map(item => item.month),
        data: (reviewsByMonth as any[]).map(item => parseInt(item.count)),
        chartData: (reviewsByMonth as any[]).map(item => ({
          label: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          value: parseInt(item.count),
        })),
      },
    },
  };
};

export const StaticsService = {
  adminStatics,
  userStatics,
};
