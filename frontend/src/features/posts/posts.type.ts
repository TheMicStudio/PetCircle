// Point d'import unique de la feature posts. Les types viennent du contrat
// partage : si le backend change un schema, le build casse ici.
export type {
    CreatePostInput,
    FeedPage,
    FeedPost,
    PostAuthor,
} from '@petcircle/contracts';
