import { jsx as _jsx } from "react/jsx-runtime";
import { View, Text } from 'react-native';
export function Layout(props) {
    return (_jsx(View, { children: _jsx(Text, { children: "Welcome to layout!" }) }));
}
export default Layout;
