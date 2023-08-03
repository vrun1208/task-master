import { useMutation } from "@tanstack/react-query";
import {
  customAxiosRequestForPost,
  customAxiosRequestForGet,
} from "./utils/axiosRequest";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from ".";
import { queryKeyForTask } from "./constant/queryKey";

// post
const usePostProjectQuery = () => {
  return useMutation({
    mutationFn: (payload) => {
      return customAxiosRequestForPost("/projects", "post", payload);
    },
    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries("projects");
      queryKeyForTask.forEach((status) =>
        queryClient.invalidateQueries(status)
      );
      queryClient.invalidateQueries(["charts-data"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error);
    },
  });
};

const getAllProjects = async () => {
  const res = await customAxiosRequestForGet("/projects");
  return res;
};

//get

const useGetProjectQuery = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
    onError: (error) => {
      toast.error(error?.response?.data?.error);
    },
  });
};

// delete
const useDeleteProjectQuery = () => {
  return useMutation({
    mutationFn: (payload) => {
      return customAxiosRequestForPost("/projects", "delete", payload);
    },
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries("projects");
      queryClient.invalidateQueries(["charts-data"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error);
    },
  });
};

export { useGetProjectQuery, usePostProjectQuery, useDeleteProjectQuery };
