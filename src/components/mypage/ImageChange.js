'use client'
import {
    Avatar,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure
} from "@nextui-org/react";
import {useMutation} from "@tanstack/react-query";
import instance from "@/config/axios-config";
import axios from "axios";
import {Bounce, toast} from "react-toastify";
import {useState} from "react";
import {FaUserCircle} from "react-icons/fa";

export default function ImageChange() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const mutation = useMutation({
        mutationFn: (selectedFile) => {
            const formData = new FormData();
            formData.append("image", selectedFile)

            return instance.put("/api/v1/members/image", formData, {
                ...axios.defaults,
                useAuth: true
            })
        },
        onSuccess: () => {
            onOpenChange();
            toast.success('이미지가 변경되었습니다', {
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

    const handleUpload = (e) => {
        e.preventDefault();
        mutation.mutate(selectedFile);
    }

    const [previewSrc, setPreviewSrc] = useState(null);

    const handlePreviewChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setPreviewSrc(reader.result);
            console.log(previewSrc)
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            setPreviewSrc(null);
        }
    };

    return (
        <div>
            <Button onPress={onOpen}>사진 변경</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">프로필 이미지 변경</ModalHeader>
                            <form onSubmit={handleUpload}>
                                <ModalBody>
                                    <div className={"flex flex-col items-center gap-3"}>
                                        <div>미리보기</div>
                                        {previewSrc ?
                                            <Avatar src={previewSrc} className={"w-44 h-44"}/> :
                                            <FaUserCircle size={100}/>
                                        }
                                        <Input type={"file"} accept={"image/*"} onChange={handlePreviewChange}/>
                                    </div>
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
        </div>
    )
}