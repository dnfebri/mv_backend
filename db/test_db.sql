SELECT `posts`.*, `user`.`id` AS`user.id`, `user`.`name` 
AS`user.name`, `user`.`username` 
AS`user.username`, `user`.`email` 
AS`user.email`, `user`.`photo` 
AS`user.photo`, `user_like_posts`.`id` 
AS`user_like_posts.id`, `user_like_posts`.`userId` 
AS`user_like_posts.userId`, `user_like_posts`.`postId` 
AS`user_like_posts.postId`, `user_like_posts`.`like` 
AS`user_like_posts.like`, `user_like_posts->user`.`id` 
AS`user_like_posts.user.id`, `user_like_posts->user`.`username` 
AS `user_like_posts.user.username` 
FROM(SELECT`posts`.`id`, `posts`.`userId`, `posts`.`caption`, `posts`.`tags`, `posts`.`likes`, `posts`.`image`, `posts`.`createdAt`, `posts`.`updatedAt` 
  FROM`posts` AS`posts` 
  WHERE(`posts`.`caption` LIKE '%berita%' OR`posts`.`tags` LIKE '%berita%') 
  ORDER BY`posts`.`id` DESC LIMIT 0, 10
  ) 
AS `posts` LEFT OUTER JOIN `users` 
AS `user` ON`posts`.`userId` = `user`.`id` 
LEFT OUTER JOIN `user_like_post` 
AS `user_like_posts` ON`posts`.`id` = `user_like_posts`.`postId` 
LEFT OUTER JOIN `users` AS `user_like_posts->user` ON`user_like_posts`.`userId` = `user_like_posts->user`.`id` 
ORDER BY`posts`.`id` DESC;