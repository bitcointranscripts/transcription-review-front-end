const ARCHIVE_TRANSCRIPTS_BY_ID = (id: number) => `transcripts/${id}/archive`;

const GET_TRANSCRIPTS = () => `transcripts`;

const GET_TRANSCRIPTS_BY_ID = (id: number) => `transcripts/${id}`;

const USERS = () => `users`;

const REVIEWS = (id?: number) => (id ? `reviews/${id}` : `reviews`);

const endpoints = {
  ARCHIVE_TRANSCRIPTS_BY_ID,
  GET_TRANSCRIPTS,
  GET_TRANSCRIPTS_BY_ID,
  USERS,
  REVIEWS,
};

export default endpoints;
