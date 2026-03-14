import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/app-layout";
import { HomePage } from "../pages/home-page";
import { LoginPage } from "../pages/login-page";
import { RegisterPage } from "../pages/register-page";
import { ProfilePage } from "../pages/profile-page";
import { NotFoundPage } from "../pages/not-found-page";
import { ProtectedRoute } from "./protected-route";
import { MyPostsPage } from "../pages/my-posts-page";
import { CreatePostPage } from "../pages/create-post-page";
import { PostCommentsPage } from "../pages/post-comments-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "profile/:id", element: <ProfilePage /> },
          { path: "my-posts", element: <MyPostsPage /> },
          { path: "create-post", element: <CreatePostPage /> },
          {
            path: "/posts/:postId/comments",
            element: <PostCommentsPage />,
          },
        ],
      },
    ],
  },
]);
