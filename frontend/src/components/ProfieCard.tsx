import {Pencil, Check, Camera} from "lucide-react";
import Image from "next/image";
import {useSelector, useDispatch} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import {selectUser, setUser} from "@/redux/userSlice";
import {UserDataType} from "@/utils/types";
import React, {useRef, useState} from "react";
import {AppDispatch} from "@/redux/store";
import api from "@/service/api";

function ProfileCard() {
    const darkMode: boolean = useSelector(selectDarkMode);
    const user: UserDataType | null = useSelector(selectUser);
    const dispatch: AppDispatch = useDispatch();
    const [username, setUsername] = useState<string | undefined>(user?.username);
    const [bio, setBio] = useState<string | undefined>(user?.bio || "");
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editUsername, setEditUsername] = useState<boolean>(false);
    const [editBio, setEditBio] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setProfilePicture(URL.createObjectURL(file));
        }
    };

    const handleProfileUpdate = async () => {
        if (!user) return;
        console.log(selectedFile)
        const formData = new FormData();
        if (selectedFile) {
            formData.append('profile_picture', selectedFile);
        }
        if (username && username !== user.username) {
            formData.append('username', username);
        }
        if (bio && bio !== user.bio) {
            formData.append('bio', bio!);
        }
        try {
            const response = await api.patch('/me', formData);
            dispatch(setUser(response.data));
        } catch (e) {
            alert("An error was occurred")
            console.log(e)
        }
        setSelectedFile(null);
        setUsername(user.username);
        setBio(user.bio);
        setEditUsername(false);
        setEditBio(false);

    };

    const handleUpdateUsername = () => {
        setEditUsername(false);
    };

    const handleUpdateBio = () => {
        setEditBio(false);
    };


    return (
        <div
            className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
            <div
                className={`rounded-2xl p-6 w-full max-w-md space-y-6 shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h2 className="text-2xl font-bold text-center">Profile</h2>

                <div className="flex justify-center">
                    <div className="relative w-32 h-32 group cursor-pointer" onClick={handleImageClick}>
                        <Image
                            src={profilePicture !== null ? profilePicture : user?.avatar_url.includes("None") === false ?
                                user?.avatar_url : "/avatar.jpg"}
                            alt="Profile picture"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full border-4 border-gray-500 group-hover:opacity-75 transition-opacity"
                        />
                        <div
                            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={32} className="text-white"/>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label
                            className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Username</label>
                        <div className="flex items-center justify-between mt-1">
                            {editUsername ? (
                                <input
                                    type="text"
                                    className={`w-full text-lg bg-transparent outline-none border-b-2 ${darkMode ? "border-gray-600 focus:border-blue-500" : "border-gray-300 focus:border-blue-500"}`}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            ) : (
                                <span className="text-lg">{username}</span>
                            )}
                            <button onClick={() => editUsername ? handleUpdateUsername() : setEditUsername(true)}
                                    className="p-2 rounded-full hover:bg-gray-700">
                                {editUsername ? <Check size={20} className="text-green-500"/> :
                                    <Pencil size={16} className="text-gray-400"/>}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label
                            className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Bio</label>
                        <div className="flex items-center justify-between mt-1">
                            {editBio ? (
                                <textarea
                                    className={`w-full text-base bg-transparent outline-none border-b-2 resize-none ${darkMode ? "border-gray-600 focus:border-blue-500" : "border-gray-300 focus:border-blue-500"}`}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                />
                            ) : (
                                <p className="text-base">{bio}</p>
                            )}
                            <button onClick={() => editBio ? handleUpdateBio() : setEditBio(true)}
                                    className="p-2 rounded-full hover:bg-gray-700">
                                {editBio ? <Check size={20} className="text-green-500"/> :
                                    <Pencil size={16} className="text-gray-400"/>}
                            </button>
                        </div>
                    </div>
                </div>

                {(selectedFile || username !== user?.username || bio !== user?.bio) && (
                    <div className="flex justify-end">
                        <button
                            onClick={handleProfileUpdate}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileCard;