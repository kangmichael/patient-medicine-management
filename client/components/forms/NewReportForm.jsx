import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, FieldArray } from 'formik'
import { addReportById } from '../../apis/reports'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { Box, Paper, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ReportCalc from '../ReportCalc.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMeds } from '../../actions/medicines'
import {
  removeSpacesEnds,
  removeSpacesAll,
  loopObj,
  removeEmptyPrescriptions,
} from '../../helper'
import Stock from '../Stock'
import { fetchStocks } from '../../actions/stocks'

//onClick calculate - pass prescriptions
//fetch medicine info on redux
//based on medName, multiply the prescribed quantity with the cost
//sum it up
//pass it as props

function NewReportForm() {
  const [totalCosts, setTotalCosts] = useState(0)
  const [totalProfits, setTotalProfit] = useState(0)
  const { id: patientId } = useParams()
  const navigate = useNavigate()

  const medInfo = useSelector((state) => state.stocks)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchStocks())
  }, [])

  async function handleSubmit(newReport) {
    let adjustedReport,
      rmSpacePrescriptions = {}

    //check if medicines prescribed
    if (newReport.prescriptions[0].medName === '') {
      if (confirm('Would you like to continue with no prescriptions?')) {
        //if intended to have no prescriptions, clear prescriptions array
        adjustedReport = { ...newReport, prescriptions: [] }
      } else {
        return null
      }
    } else {
      //Remove empty prescriptions
      const rmEmptyPrescrips = {
        ...newReport,
        prescriptions: removeEmptyPrescriptions(newReport.prescriptions),
      }

      //Check if entered medicines' names match the names in current stocks
      const correctPrescription = rmEmptyPrescrips.prescriptions.every(
        (prescription) => {
          console.log(prescription.medName)
          return medInfo.find((info) => info.medName === prescription.medName)
        }
      )

      if (!correctPrescription) {
        alert(
          "Please make sure medicines' names are spelt correctly and are in current stocks"
        )
        return null
      }

      //Remove white spaces from the medicine names
      rmSpacePrescriptions = rmEmptyPrescrips.prescriptions.map((med, i) => {
        //Check for duplicates - attempting to use a solution that's O(n) instead of O(n2)
        return { ...med, medName: removeSpacesAll(med.medName) }
      })

      rmSpacePrescriptions.forEach((med, i) => {
        const temp = { 百合: 1 }
        console.log('med', med.medName)
        console.log('temp', temp)
        console.log('temp[med.medName]', temp[med.medName])
        console.log('med.medName]', med.medName)
        if (temp[med.medName] === med.medName) {
          console.log('if')
          console.log('temp[med]', temp[med.medName])
          alert(`${med} is repeated in this prescription`)
          return null
        } else {
          console.log('else')
          temp[med.medName] = i
        }
      })

      adjustedReport = { ...newReport, prescriptions: rmSpacePrescriptions }
    }

    const combinedReport = { ...adjustedReport, totalCosts, totalProfits }

    try {
      await addReportById(combinedReport, patientId)
      navigate(`/patient/${patientId}`)
    } catch (error) {
      console.error(error)
    }
  }

  // 百合 白扁豆
  function handleCalc(newReport) {
    const { prescriptions, prescriptionNumber, prescriptionPrice } = newReport
    const cost = prescriptions.reduce((total, prescription) => {
      medInfo.forEach((info) =>
        info.medName === removeSpacesAll(prescription.medName)
          ? (total +=
              (info.cost / 100) *
              prescription.prescribedQuantity *
              prescriptionNumber)
          : null
      )
      return total
    }, 0)
    setTotalCosts(cost)
    setTotalProfit(prescriptionNumber * prescriptionPrice - cost)
  }

  const initialValues = {
    reports: {
      diagnosis: '',
      prescriptionNumber: '0',
      prescriptionPrice: '0',
      prescriptions: [
        {
          medName: '',
          prescribedQuantity: 0,
        },
        {
          medName: '',
          prescribedQuantity: 0,
        },
        {
          medName: '',
          prescribedQuantity: 0,
        },
        {
          medName: '',
          prescribedQuantity: 0,
        },
      ],
    },
  }

  return (
    <Box>
      <Box
        sx={{
          '& .MuiTextField-root': { m: 1 },
          width: '80%',
          maxWidth: '650px',
        }}
        noValidate
        autoComplete="off"
      >
        <Link style={{ textDecoration: 'none' }} to={`/patient/${patientId}`}>
          <Button variant="outlined" size="small">
            <ArrowBackIcon sx={{ mr: 1 }} /> Patient
          </Button>
        </Link>
        <Typography variant="h4" sx={{ mb: 4, mt: 3 }}>
          New Report
        </Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => handleSubmit(values.reports)}
          enableReinitialize
        >
          {({ values }) => (
            <Box
              sx={{
                display: 'grid',
                width: '500px',
                justifyContent: 'center',
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                }}
              >
                <Form>
                  <Typography variant="h6">Diagnosis</Typography>
                  <Field
                    style={{
                      height: 80,
                      width: 360,
                      marginRight: 16,
                      marginTop: 16,
                      marginBottom: 8,
                      border: '0.5px solid grey',
                      borderRadius: '5px',
                    }}
                    name="reports.diagnosis"
                    as="textarea"
                  />
                  <Typography variant="h6">Prescription</Typography>
                  <FieldArray name="reports.prescriptions">
                    {({ insert, remove, push }) => (
                      <Box>
                        {values.reports.prescriptions.length > 0 &&
                          values.reports.prescriptions.map((v, index) => (
                            <Box key={index}>
                              <Field
                                style={{
                                  height: 40,
                                  width: 160,
                                  marginRight: 16,
                                  marginTop: 16,
                                  border: '0.5px solid grey',
                                  borderRadius: '5px',
                                }}
                                name={`reports.prescriptions.${index}.medName`}
                                placeholder="Medicine Name"
                                type="text"
                              />

                              <Field
                                style={{
                                  height: 40,
                                  width: 160,
                                  marginRight: 16,
                                  marginTop: 16,
                                  border: '0.5px solid grey',
                                  borderRadius: '5px',
                                }}
                                name={`reports.prescriptions.${index}.prescribedQuantity`}
                                placeholder="Quantity"
                                type="number"
                              />

                              <Button
                                color="primary"
                                onClick={() => remove(index)}
                              >
                                <DeleteIcon />
                              </Button>
                            </Box>
                          ))}
                        <Typography sx={{ mt: 2 }} variant="body2">
                          Prescription Number:
                        </Typography>
                        <Field
                          style={{
                            height: 40,
                            width: 180,
                            marginRight: 16,
                            marginTop: 16,
                            marginBottom: 8,
                            border: '0.5px solid grey',
                            borderRadius: '5px',
                          }}
                          label="Prescription Number"
                          name="reports.prescriptionNumber"
                        />

                        <Typography variant="body2">
                          Prescription Price:
                        </Typography>
                        <Field
                          style={{
                            height: 40,
                            width: 180,
                            marginRight: 16,
                            marginTop: 16,
                            marginBottom: 8,
                            border: '0.5px solid grey',
                            borderRadius: '5px',
                          }}
                          label="Prescription Price"
                          name="reports.prescriptionPrice"
                        />

                        <Box
                          sx={{
                            display: 'grid',
                            Button: { mt: 3, mr: 2 },
                            justifyContent: 'center',
                          }}
                        >
                          <Button
                            color="primary"
                            variant="outlined"
                            onClick={() =>
                              push({
                                medName: '',
                                prescribedQuantity: 0,
                              })
                            }
                          >
                            Add stock
                          </Button>
                          <Button
                            color="secondary"
                            variant="outlined"
                            onClick={() => handleCalc(values.reports)}
                          >
                            Calculate
                          </Button>
                          <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            // onclick={}
                          >
                            Submit
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </FieldArray>
                </Form>
              </Paper>
            </Box>
          )}
        </Formik>
      </Box>
      <Box>
        <ReportCalc profits={totalProfits} costs={totalCosts} />
      </Box>
      <Box>
        <Stock />
      </Box>
    </Box>
  )
}

export default NewReportForm
