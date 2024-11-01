import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Profile from "../pages/Profile";
import Main from "../pages/Main";
import Post from "../pages/Post";
import PostCreate from "../pages/PostCreate";
import PostEdit from "../pages/PostEdit";
import CategoriesEditor from "../pages/CategoriesEditor";
import CreateCategory from "../pages/CreateCategory";
import PasswordRecovery from "../pages/PasswordRecovery";
import PasswordReset from "../pages/PasswordReset";
import Error from "../pages/Error";
import Users from "../pages/Users";


export const publicRoutes = [
    {path:'/posts/create', element: PostCreate},
    {path:'/posts/:post_id', element: Post},
    {path:'/profile/:user_id', element: Profile},
    {path:'/login', element: Login},
    {path:'/registration', element: Registration},
    {path:'/main', element: Main},
    {path:'/posts/:post_id/edit', element: PostEdit},
    {path:'/categoriesEditor', element: CategoriesEditor},
    {path:'/createCategory', element: CreateCategory},
    {path:'/password-recovery', element: PasswordRecovery},
    {path:'/password-reset/:token', element: PasswordReset},
    {path:'/error', element: Error},
    {path:'/users', element: Users}
];