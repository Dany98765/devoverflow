const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  PROFILE: (id) => `/profile/${id}`,
  COMMUNITY: '/community',
  COLLECTIONS: '/collections',
  JOBS: '/jobs',
  TAGS: '/tags',
  ASK_A_QUESTION: '/ask-a-question',
  QUESTION_DETAILS: (id) => `/question/${id}`,
  TAG_DETAILS: (id) => `/tags/${id}`,
  NOT_FOUND: '*',
}

export default ROUTES;