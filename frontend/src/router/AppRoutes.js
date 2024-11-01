import {Routes, Route, Navigate} from 'react-router-dom';
import {publicRoutes} from "./routes";

const AppRoutes = () => {
    return (
        <Routes>
            {publicRoutes.map(route => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<route.element />}
                />
            ))}

            <Route
                key="all-other-routes"
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </Routes>
    );
};

export default AppRoutes;
