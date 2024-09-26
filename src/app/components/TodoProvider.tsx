import { Provider } from 'react-redux';
import store from "@/app/store/store";

interface ReduxProviderProps {
    children: React.ReactNode;
}

export default function TodoProvider({ children }: ReduxProviderProps) {
    return <Provider store={store}>{children}</Provider>;
}
