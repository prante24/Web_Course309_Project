import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { motion } from "framer-motion";
import { FolderPlus, Loader2, Link as LinkIcon, FileText, Video, Image } from "lucide-react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { AuthContext } from "@/provider/AuthProvider";

const resourceTypes = [
    { value: "link", label: "Link", icon: LinkIcon },
    { value: "document", label: "Document", icon: FileText },
    { value: "video", label: "Video", icon: Video },
    { value: "image", label: "Image", icon: Image },
];

const AddResourceModal = ({ isOpen, onClose, classId, onResourceAdded }) => {
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("link");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Please enter a title");
            return;
        }

        if (!url.trim()) {
            toast.error("Please enter a URL");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`https://edumanagebackend.vercel.app/classes/${classId}/resources`, {
                title: title.trim(),
                description: description.trim(),
                type,
                url: url.trim(),
                teacherId: user?.uid,
            });

            toast.success("Resource added successfully!");
            onResourceAdded?.();
            handleClose();
        } catch (error) {
            console.error("Error adding resource:", error);
            toast.error("Failed to add resource");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTitle("");
        setDescription("");
        setType("link");
        setUrl("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                            <FolderPlus className="w-5 h-5" />
                            Add Resource
                        </DialogTitle>
                        <DialogDescription className="text-primary-foreground/80">
                            Share a resource with your students
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Course Syllabus, Lecture Notes Week 1"
                            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Resource Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {resourceTypes.map((rt) => (
                                    <SelectItem key={rt.value} value={rt.value}>
                                        <div className="flex items-center gap-2">
                                            <rt.icon className="w-4 h-4" />
                                            {rt.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <Label htmlFor="url">URL / Link *</Label>
                        <Input
                            id="url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://drive.google.com/... or https://youtube.com/..."
                            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Link to Google Drive, YouTube, Dropbox, or any other URL
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this resource..."
                            rows={3}
                            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <FolderPlus className="w-4 h-4 mr-2" />
                                    Add Resource
                                </>
                            )}
                        </Button>
                    </div>
                </motion.form>
            </DialogContent>
        </Dialog>
    );
};

AddResourceModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    classId: PropTypes.string.isRequired,
    onResourceAdded: PropTypes.func,
};

export default AddResourceModal;
