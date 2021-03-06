import React, { useContext } from "react";
import {
  Container,
  Button,
  Input,
  Flex,
  Checkbox,
  Text,
  IconButton,
  Label,
  Box,
  Spinner,
} from "theme-ui";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { dark } from "@theme-ui/presets";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Link, navigate } from "gatsby";
import Home from "./index";
import { Navbar } from "../components/Navbar";
import { Router, RouteComponentProps } from "@reach/router";
import { IdentityContext } from "../utilities/identity-context";

const GET_TODO = gql`
  query($userToken: String!) {
    getTodos(token: $userToken) {
      id
      title
      done
    }
  }
`;

const ADD_TODO = gql`
  mutation($title: String!, $userToken: String!, $done: Boolean!) {
    addTodo(title: $title, userToken: $userToken, done: $done) {
      id
      title
      done
    }
  }
`;

const UPDATE_TODO = gql`
  mutation($todo: TodoInput!) {
    updateTodo(todo: $todo) {
      id
      title
      done
    }
  }
`;

const DELETE_TODO = gql`
  mutation($id: String!) {
    deleteTodo(id: $id)
  }
`;

let Dashboard = () => {
  const userData = useContext(IdentityContext);
  console.log(userData.user?.username);

  const { loading, error, data } = useQuery(GET_TODO, {
    variables: {
      userToken: `${userData.user?.username}`,
    },
  });
  const [addTodo] = useMutation(ADD_TODO);
  const addTask = (title: string) => {
    addTodo({
      variables: {
        title,
        userToken: `${userData.user?.username}`,
        done: false,
      },
      refetchQueries: [
        {
          query: GET_TODO,
          variables: {
            userToken: `${userData.user?.username}`,
          },
        },
      ],
    });
  };

  const [updateTodo] = useMutation(UPDATE_TODO);
  const updateTask = (id: string, title: string, done: boolean) => {
    updateTodo({
      variables: {
        todo: {
          id,
          title,
          done,
        },
      },
      refetchQueries: [
        {
          query: GET_TODO,
          variables: {
            userToken: `${userData.userToken}`,
          },
        },
      ],
    });
  };

  const [deleteTodo] = useMutation(DELETE_TODO);
  const deleteTask = (id) => {
    deleteTodo({
      variables: {
        id: id,
      },
      refetchQueries: [
        {
          query: GET_TODO,
          variables: {
            userToken: `${userData.user?.username}`,
          },
        },
      ],
    });
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("*Enter Task Name"),
  });

  const handleEdit = async (refId: any, done: boolean) => {
    const result: any = await Swal.mixin({
      input: "text",
      confirmButtonText: "Update",
      showCancelButton: true,
    }).queue([
      {
        titleText: "Enter Task",
        input: "text",
      },
    ]);
    if (result.value) {
      const { value } = result;
      console.log(value);
      updateTask(refId, value[0], done);
    }
  };

  if (error) return <div>{`Error ${JSON.stringify(error)}`}</div>;

  return (
    <Container>
      <Navbar />
      <h1 style={{ color: dark.colors.primary, textAlign: "center" }}>
        Todo App
      </h1>
      <Formik
        initialValues={{ title: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          resetForm({
            values: { title: "" },
          });
          console.log(values);
          addTask(values.title);
        }}
      >
        {({ values, handleSubmit, handleChange, touched, errors }) => (
          <Box
            as="form"
            sx={{
              margin: "0 auto",
            }}
            mt="4"
            onSubmit={handleSubmit}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <Input
                name="title"
                sx={{ width: "40%", margin: "0 5px" }}
                placeholder="Enter Task"
                value={values.title}
                onChange={handleChange}
              />

              <Button style={{ margin: "0 5px" }} type="submit">
                Add Task
              </Button>
            </div>
            {touched.title && errors.title ? (
              <p
                style={{ fontSize: "15px", color: "red", textAlign: "center" }}
              >
                {errors.title}
              </p>
            ) : null}
          </Box>
        )}
      </Formik>

      {loading ? (
        <div style={{ margin: "15px auto", textAlign: "center" }}>
          <Spinner />
        </div>
      ) : (
        <ul style={{ padding: "0px" }}>
          {console.log(data)}
          {data &&
            data.getTodos.map((task, ind) => {
              return (
                <Flex
                  as="li"
                  key={ind}
                  sx={{
                    backgroundColor: dark.colors.highlight,
                    width: ["90%", null, "75%"],
                    margin: "20px auto",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                  my="3"
                >
                  <div style={{ margin: "auto 0" }}>
                    <Label>
                      <Checkbox
                        defaultChecked={task.done}
                        onChange={() => {
                          updateTask(task.id, task.title, !task.done);
                        }}
                      />
                    </Label>
                  </div>
                  <Text
                    sx={{
                      fontSize: 4,
                      fontWeight: "bold",
                    }}
                  >
                    {task.title}
                  </Text>
                  <div style={{ marginLeft: "auto" }}>
                    <IconButton
                      aria-label="Toggle dark mode"
                      onClick={() => {
                        console.log(task.id);
                        handleEdit(task.id, task.done);
                      }}
                    >
                      <EditIcon htmlColor={dark.colors.primary} />
                    </IconButton>
                    <IconButton
                      aria-label="Toggle dark mode"
                      onClick={() => {
                        deleteTask(task.id);
                      }}
                    >
                      <DeleteIcon htmlColor={dark.colors.primary} />
                    </IconButton>
                  </div>
                </Flex>
              );
            })}
        </ul>
      )}
      {/* <Link to="/">Home</Link> */}
    </Container>
  );
};

export default () => {
  const userData = useContext(IdentityContext);
  return (
    <div>{userData === null ? <Home /> : <Dashboard />}</div>
    // <Dashboard />
  );
};
