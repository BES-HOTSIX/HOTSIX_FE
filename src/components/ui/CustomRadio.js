import {Radio} from "@nextui-org/react";

export const CustomRadio = (props) => {
    const {children, ...otherProps} = props;

    return (
        <Radio
            {...otherProps}
            classNames={{
                base: "bg-white m-1 border-blue-500 border-2 rounded-md",
            }}
        >
            {children}
        </Radio>
    );
};