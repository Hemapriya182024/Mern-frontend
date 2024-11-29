import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { baseurl } from "../../App";
import toast from 'react-hot-toast'
import {formatPostDate} from '../../utils/data/index'

const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const {data:authUser}=useQuery({queryKey:['authUser']})
		const queryClient=useQueryClient()
	// console.log(authUser)
	// console.log("authUser._id ",authUser._id)
	// console.log("post.user._id ",post.user._id )
	const{mutate:deletePost,isPending:isDeleting}=useMutation(
		{
			mutationFn:async()=>{
				const res=await axios.delete(`${baseurl}/api/posts/${post._id}`,{withCredentials:true})
				return res
			},
			onSuccess:()=>{
				toast.success("Post deleted sucessfully")
				queryClient.invalidateQueries({queryKey:["posts"]})

			}
		}
		
	)
	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
		  try {
			const res = await axios.post(
			  `${baseurl}/api/posts/like/${post._id}`,
			  {},
			  { withCredentials: true } // Correct placement of `withCredentials`
			);
	  
			if (!res.data) {
			  throw new Error(res.error || "Something went wrong!!");
			}
	  
			console.log(res.data);
			return res.data;
		  } catch (error) {
			throw new Error(error.message || "An unexpected error occurred"); // Provide meaningful error messages
		  }
		},
		onSuccess: () => {
		  toast.success("Post liked");
		  queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		// onSuccess: (updatedLikes) => {
		// 	toast.success("Post liked");
		  
		// 	queryClient.setQueryData(["posts"], (oldData) => {
		// 	  // Ensure `oldData` is valid
		// 	  if (!oldData || !Array.isArray(oldData)) return oldData;
		  
		// 	  return oldData.map((p) => {
		// 		if (p._id === post._id) { // Use `post._id` for comparison
		// 		  return { ...p, likes: updatedLikes }; // Update likes
		// 		}
		// 		return p; // Return other posts unchanged
		// 	  });
		// 	});
		//   },
		  
		onError: (error) => { // Correctly receive the `error` object
		  toast.error(error.message || "Failed to like the post");
		},
	  });
	
	  const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
		  try {
			const res = await axios.post(
			  `${baseurl}/api/posts/comment/${post._id}`,
			  { text: comment },
			  { withCredentials: true }
			);
	  
			// Check for a successful response
			if (res.status !== 200) {
			  throw new Error("Failed to post the comment!");
			}
	  
			console.log(res.data);
			return res.data; // Return the response data if successful
		  } catch (error) {
			throw error.response?.data?.message || error.message || "Something went wrong!";
		  }
		},
		onSuccess: () => {
		  toast.success("Comment added successfully!");
		  setComment(""); // Clear the comment input field
		  queryClient.invalidateQueries({ queryKey: ["posts"] }); // Refresh posts query
		},
		onError: (error) => {
		  toast.error(error); // Show a meaningful error message
		},
	  });
	  

	const isMyPost = authUser._id === post.user._id ;
	const postOwner = post.user;
	 const isLiked = post.likes.includes(authUser._id);


	

	const formattedDate = formatPostDate(post.createdAt)

	// const isCommenting = true;

	const handleDeletePost = () => {
		deletePost()
	};

	const handlePostComment = (e) => {
		e.preventDefault();
		if(isCommenting) return
		commentPost()
	};

	const handleLikePost = () => {
		if(isLiking) return;
		
			likePost()

		
		
	};

	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
						<img src={postOwner.profileImg || "/profile.jpeg"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${postOwner.username}`} className='font-bold'>
							{postOwner.fullName}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								<FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{post.text}</span>
						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.comments.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}
										{post.comments.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profileImg || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullName}</span>
														<span className='text-gray-700 text-sm'>
															@{comment.user.username}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? (
												<span className='loading loading-spinner loading-md'></span>
											) : (
												"Post"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
								{!isLiked && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : "text-slate-500"
									}`}
								>
									{post.likes.length}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;