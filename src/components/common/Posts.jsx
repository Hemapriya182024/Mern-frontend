// import Post from "./Post.jsx";
// import PostSkeleton from "../skeletons/PostSkeleton";
// import { baseurl } from "../../App.jsx";
// import { useQuery } from "@tanstack/react-query";
// import { useEffect } from "react";
// import axios from "axios";

// const Posts = ({ feedType ,username,userId }) => {
//   const getPostEndpoint = () => {
//     switch (feedType) {
//       case "forYou":
//         return `${baseurl}/api/posts/all`;
//       case "following":
//         return `${baseurl}/api/posts/following`;
//         case "posts":
//           return `${baseurl}/api/posts/user/${username}`;
//         case "likes":
//           return `${baseurl}/api/posts/likes/${userId}`;
//       default:
//         return `${baseurl}/api/posts/all`;
//     }
//   };

//   const POST_ENDPOINT = getPostEndpoint();

//   const { data: posts, isLoading, refetch, error } = useQuery({
//     queryKey: ["posts", feedType],
//     queryFn: async () => {
//       try {
//         const res = await axios.get(POST_ENDPOINT, { withCredentials: true });
//         console.log("API Data:", res.data); // Debug log for API response
//         return res.data;
//       } catch (err) {
//         console.error("Error:", err.response || err.message);
//         throw new Error(err.response?.data?.message || err.message || "Something went wrong!");
//       }
//     },
//   });

//   useEffect(() => {
//     refetch();
//   }, [feedType]);

//   console.log("Posts Data:", posts); // Debug log for posts

//   return (
//     <>
//       {isLoading && (
//         <div className="flex flex-col justify-center">
//           <PostSkeleton />
//           <PostSkeleton />
//           <PostSkeleton />
//         </div>
//       )}
//       {!isLoading && error && <p className="text-center my-4 text-red-500">{error.message}</p>}
//       {!isLoading && posts?.length === 0 && <p className="text-center my-4">No posts in this tab. Switch 👻</p>}
//       {!isLoading && posts && (
//         <div>
//           {posts.map((post) => (  
//             <Post key={post._id} post={post} />
//           ))}
//         </div>
//       )}
//     </>
//   );
// };

// export default Posts;

import Post from "./Post.jsx";
import PostSkeleton from "../skeletons/PostSkeleton";
import { baseurl } from "../../App.jsx";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import axios from "axios";

const Posts = ({ feedType, username, userId }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return `${baseurl}/api/posts/all`;
      case "following":
        return `${baseurl}/api/posts/following`;
      case "posts":
        return `${baseurl}/api/posts/user/${username}`;
      case "likes":
        return `${baseurl}/api/posts/likes/${userId}`;
      default:
        return `${baseurl}/api/posts/all`;
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const { data: posts, isLoading, refetch, error } = useQuery({
    queryKey: ["posts", feedType],
    queryFn: async () => {
      const res = await axios.get(POST_ENDPOINT, { withCredentials: true });
      console.log("API Data:", res.data); // Debug log
      return  res.data 
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType,refetch,username]);

  console.log("Posts Data:", posts); // Debug log

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && error && <p className="text-center my-4 text-red-500">{error.message}</p>}
      {!isLoading && posts.length === 0 && <p className="text-center my-4">No posts in this tab. Switch 👻</p>}
      {!isLoading && posts.length > 0 && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;

