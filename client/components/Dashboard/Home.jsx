import React from "react"
import TcmAPI from "./TcmAPI"
import Restock from "./Restock"
import BarChart from "./Charts/BarChart"
import PieChart from "./Charts/PieChart"
import { Box } from "@mui/system"
import { Grid, Paper, Typography } from "@mui/material"
import { useState } from "react"
import { Button } from "@material-ui/core"

function Home() {
  const [nextMed, setNextMed] = useState(0)
  function handleNext() {
    setNextMed(nextMed + 1)
  }
  return (
    <>
      <Box
        className="cover"
        style={{
          padding: 20,
        }}
      >
        <Grid
          container
          spacing={{ xs: 1, sm: 1, md: 2 }}
          style={{ minWidth: "640px" }}
        >
          <Grid item xs={12} sm={12} md={12} lg={7}>
            <BarChart />
            <PieChart />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={5}>
            <Paper elevation={2}>
              <Typography
                style={{
                  paddingLeft: "12px",
                  paddingTop: "12px",
                  paddingBottom: "4px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Did you know?
              </Typography>
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{
                  minWidth: "400px",
                  padding: "35px",
                  maxHeight: "700px",
                }}
              >
                <Box
                  style={{
                    maxWidth: "90%",
                    border: "0.25px solid lightgrey",
                    align: "center",
                    paddingLeft: "25px",
                    paddingRight: "25px",
                    marginTop: "20px",
                    maxHeight: "450px",
                    overflowY: "scroll",
                  }}
                >
                  <TcmAPI nextMed={nextMed} />
                </Box>
                <Button
                  color="primary"
                  style={{ marginTop: "15px" }}
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Grid>
            </Paper>
            <Paper
              elevation={2}
              style={{
                marginTop: "16px",
                marginBottom: "8px",

                border: "0.25px solid lightgrey",
                fontFamily: "sans-serif",
              }}
            >
              {" "}
              <Typography
                style={{
                  paddingLeft: "12px",
                  paddingTop: "12px",
                  paddingBottom: "4px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Reminders
              </Typography>
              <Box
                style={{
                  borderTop: "0.25px solid lightgrey",
                  paddingLeft: "15px",
                }}
              >
                <Restock />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Home
