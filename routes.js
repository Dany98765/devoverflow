const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  PROFILE: '/profile',
  COMMUNITY: '/community',
  COLLECTIONS: '/collections',
  JOBS: '/jobs',
  TAGS: '/tags',
  ASK_A_QUESTION: '/ask-a-question',
  QUESTION_DETAILS: (id) => `/question/${id}`,
  TAG_DETAILS: (id) => `/tag/${id}`,
  NOT_FOUND: '*',
}

export default ROUTES;