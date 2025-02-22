import { Grid, Box, Typography, Button, Divider } from "@mui/material";
import colors from "src/theme/variables";
import InfoPart from "src/components/auth/components/InfoPart";
import { Formik, Form } from "formik";
import { registerSchema } from "src/constant/validation";
import FormikControls from "src/common/formik/FormikControls";
import useRegister from "src/hook/auth/useRegister";
// import CommonLoader from "src/common/loader/CommonLoader";
import { useBackDropLoaderContext } from "src/context/BackDropLoaderContext";
import { useDispatch } from "react-redux";
import { isBackDropLoaderDisplayed } from "src/redux/boolean/booleanSlice";
import { CommonLoaderWithBackDrop } from "src/common/loader/CommonLoader";
import logoImage from "src/assets/icons/Logo.png";

const Register = () => {
  const { handleSubmit, initialValues, isLoading, setValuesOfForm } = useRegister();
  const dispatch = useDispatch();

  const { setValue } = useBackDropLoaderContext();
  if (isLoading) {
    setValue("Redirecting...");
    dispatch(isBackDropLoaderDisplayed(true));
  }

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          background: colors.mainColor,
        }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            ml: 3,
            height: "2rem",
            padding: ".5rem 0",
          }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img src={logoImage} alt="project" style={{ width: "40px" }} />

            <Typography sx={{ color: "white", fontWeight: "bold" }}>Task Master</Typography>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            // border: "1px solid red",
            width: "70%",
            margin: "auto",
            marginTop: "2rem",
          }}>
          <Box>
            <Typography
              sx={{
                fontSize: "1.7rem",
                color: "white",
              }}>
              Register
            </Typography>
            <Typography
              sx={{
                marginTop: 3,
                fontWeight: "500",
                color: (theme) => theme.palette.text.primary,
              }}>
              Welcome to Task Master. Manage your task with task master and make your life productive.
            </Typography>
          </Box>
          <Box sx={{ width: "100%", mt: 2 }}>
            <Formik initialValues={initialValues} validationSchema={registerSchema} onSubmit={handleSubmit}>
              {({ values, handleSubmit }) => (
                <Form
                  onBlur={() => {
                    setValuesOfForm(values);
                  }}>
                  <FormikControls control="formikInput" name="email" />
                  <Typography color={"red"}>{}</Typography>
                  <FormikControls control="formikInput" name="password" />
                  <FormikControls control="formikInput" name="confirmPassword" />
                  <Divider
                    sx={{
                      mt: 4,
                      mb: 3,
                    }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      onClick={handleSubmit}
                      sx={{
                        backgroundColor: colors.primaryColor,
                      }}>
                      register
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mt: 2,
            }}>
            <Typography sx={{ color: "white" }}>
              Already have account{" "}
              <a style={{ fontWeight: "700", color: "white" }} href="/login">
                login
              </a>
            </Typography>
          </Box>
        </Box>
      </Grid>
      <InfoPart />
      <CommonLoaderWithBackDrop />
    </Grid>
  );
};

export default Register;
