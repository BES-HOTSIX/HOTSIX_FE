'use client'
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure
} from "@nextui-org/react";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import instance from "@/config/axios-config";
import {Bounce, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

export default function PassChange() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [passwordError, setPasswordError] = useState({state: false, message: ""});

    const mutation = useMutation({
        mutationFn: (password) => {
            return instance.put("/api/v1/members/password", password, {
                ...axios.defaults,
                useAuth: true
            })
        },
        onSuccess: () => {
            onOpenChange();
            toast.success('비밀번호가 변경되었습니다.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    })


    const validatePassword = () => {
        if (password.length < 8) {
            setPasswordError({state: true, message: "비밀번호는 8자리 이상이어야 합니다."});
            return false;
        } else if (password !== passwordCheck) {
            setPasswordError({state: true, message: "비밀번호가 일치하지 않습니다."});
            return false;
        } else {
            setPasswordError({state: false, message: ""});
            return true;
        }
    }

    const formSubmitHandler = (e) => {
        e.preventDefault();
        if (validatePassword()) {
            mutation.mutate({password: password, passwordCheck: passwordCheck})
        }
    }

    return (
        <>
            <Button className={"bg-white"} onPress={onOpen}>수정</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">비밀번호 변경</ModalHeader>
                            <form onSubmit={formSubmitHandler}>
                                <ModalBody>
                                    <Input placeholder="변경할 비밀번호"
                                           value={password}
                                           onValueChange={setPassword}
                                           type={"password"}/>
                                    <Input placeholder="비밀번호 재확인"
                                           onBlur={validatePassword}
                                           isInvalid={passwordError.state}
                                           errorMessage={passwordError.message}
                                           value={passwordCheck}
                                           onValueChange={setPasswordCheck}
                                           type={"password"}/>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color={"primary"} type={"submit"}
                                            isLoading={mutation.isPending}>수정</Button>
                                    <Button onPress={onOpenChange}>취소</Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}