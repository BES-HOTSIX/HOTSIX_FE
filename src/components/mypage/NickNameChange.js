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
import {Bounce, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import instance from "@/config/axios-config";

import {useUser} from "@/hooks/useUser";


export default function NickNameChange() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [nickName, setNickName] = useState("");
    const [error, setError] = useState({state: false, message: ""});

    const {refetch} = useUser();


    const mutation = useMutation({
        mutationFn: () => {
            return instance.put(`/api/v1/members/nickname?nickname=${nickName}`, null, {
                ...axios.defaults,
                useAuth: true,
            })
        },
        onSuccess: () => {
            onOpenChange();
            refetch();

            toast.success('닉네임이 변경되었습니다.', {
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


    const validate = async () => {
        try {
            const res = await instance.get(`/api/v1/members/nickname/exists?nickname=${nickName}`, {
                ...axios.defaults,
                useAuth: true,
            })

            setError({state: false, message: ""});
            return true;
        } catch (e) {
            setError({state: true, message: "이미 존재하는 닉네임입니다."});
            return false
        }
    }

    const formSubmitHandler = (e) => {
        e.preventDefault();
        validate().then(() => {
            mutation.mutate()
        })
    }

    return (
        <>
            <Button className={"bg-white"} onPress={onOpen}>수정</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">닉네임 변경</ModalHeader>
                            <form onSubmit={formSubmitHandler}>
                                <ModalBody>
                                    <Input placeholder="변경할 닉네임"
                                           onBlur={validate}
                                           isInvalid={error.state}
                                           errorMessage={error.message}
                                           value={nickName}
                                           onValueChange={setNickName}
                                           type={"text"}/>
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