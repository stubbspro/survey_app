'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import FormBuilder from '@/components/FormBuilder';
import updateResultSpreadsheet from '@/app/services/updateResultSpreadsheet';
import getTherapy from '@/app/services/getTherapy';
import updateTherapiesSpreadsheet from '@/app/services/updateTherapiesSpreadsheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateFormValidationSchema } from '@/app/utils/generateSchemeValidation';
import Alert from '../Alert';
import Finish from '../Finish';

const ClientForm = ({ data, userId, surveySpreadsheetId, screensInfo }) => {
  const [screen, setScreen] = useState(1);
  const [formData, setFormData] = useState(data);
  const [currentScreensInfo, setCurrentScreensInfo] = useState(screensInfo);
  const [timer, setTimer] = useState(currentScreensInfo[screen]?.minTime);
  const [currentTherapyId, setCurrentTherapyId] = useState(null);
  const [therapiesLoaded, setTherapiesLoaded] = useState(false);
  const [totalScreens, setTotalScreens] = useState(Object.keys(data).length);
  const [finish, setFinish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [formErrorAlertOpen, setFormErrorAlertOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(userId);
  const [currentSurveySpreadsheetId, setCurrentSurveySpreadsheetId] =
    useState(surveySpreadsheetId);
  const screenTimerRef = useRef(0);

  const formValidationSchema = generateFormValidationSchema(formData);

  const form = useForm({
    shouldUnregister: true,

    resolver: formValidationSchema[screen]
      ? zodResolver(formValidationSchema[screen])
      : undefined,
  });

  const handleSubmit = async (data) => {
    if (timer > 0) {
      return setAlertOpen(true);
    }
    setLoading(true);

    try {
      if (currentScreensInfo[screen].questionType !== 'therapy') {
        await updateResultSpreadsheet({
          screen: +screen,
          timeSpent: screenTimerRef.current,
          userId: currentUserId,
          spreadsheetId: currentSurveySpreadsheetId,
          answers: data,
          answerType: currentScreensInfo[screen].questionType,
          totalScreens,
          currentTherapyId,
        });
        if (
          currentScreensInfo[screen + 1].questionType === 'therapy' &&
          !therapiesLoaded
        ) {
          const therapyScreensCount = Object.values(currentScreensInfo).filter(
            (value) => value.questionType === 'therapy'
          ).length;
          const therapyRes = await getTherapy(
            data['$CONDITION'],
            currentSurveySpreadsheetId,
            therapyScreensCount
          );
          if (therapyRes) {
            setSelectedCondition(data['$CONDITION']);
            setTherapiesLoaded(true);
            setCurrentTherapyId(therapyRes.data.therapyId);
            const therapiesScreens = therapyRes.data.therapiesScreenData.map(
              (therapy, i) => {
                return {
                  [screen + (i + 1)]: therapy,
                };
              }
            );
            setTotalScreens((prev) => prev + therapiesScreens.length);
            setFormData((prev) => {
              return {
                ...prev,
                ...therapiesScreens.reduce((acc, therapy) => {
                  const therapyScreenKey = Object.keys(therapy)[0];
                  acc[therapyScreenKey] = therapy[therapyScreenKey];
                  return acc;
                }, {}),
              };
            });
          }
        }
      } else {
        if (currentScreensInfo[screen].questionType === 'therapy') {
          const currentTherapy = formData[screen].find(
            ({ type }) => type === 'therapy-assessment-buttons'
          ).questionId;

          await updateTherapiesSpreadsheet({
            screen: +screen,
            timeSpent: screenTimerRef.current,
            userId: currentUserId,
            spreadsheetId: currentSurveySpreadsheetId,
            currentTherapy,
            assessment: data[currentTherapy],
            condition: selectedCondition,
          });
          if (screen === totalScreens) {
            setFinish(true);
          }
        }
      }
      setScreen(screen + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAnotherSurvey = async ({
    data,
    userId,
    screensInfo,
    surveySpreadsheetId,
  }) => {
    setFinish(false);
    setScreen(1);
    form.reset();
    setCurrentUserId(userId);
    setFormData(data);
    setCurrentSurveySpreadsheetId(surveySpreadsheetId);
    setCurrentScreensInfo(screensInfo);
    setTherapiesLoaded(false);
    setTotalScreens(Object.keys(data).length);
  };

  useEffect(() => {
    if (finish) {
      return;
    }
    setTimer(currentScreensInfo[screen]?.minTime);

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(intervalId);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [screen, currentScreensInfo, finish]);

  useEffect(() => {
    screenTimerRef.current = 0;
    const intervalId = setInterval(() => {
      screenTimerRef.current += 1;
    }, 1000);

    return () => clearInterval(intervalId);
  }, [screen]);

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      setFormErrorAlertOpen(true);
    }
  }, [form.formState.errors]);

  return (
    <>
      {finish ? (
        <Finish handleTakeAnotherSurvey={handleTakeAnotherSurvey} />
      ) : (
        <FormBuilder
          onSubmit={handleSubmit}
          formHook={form}
          formFields={formData[screen]}
          allowSendData={timer <= 0}
          loading={loading}
          withNextIcon={screen > 1}
          buttonText={screen === 1 ? 'Continue' : 'Next'}
        />
      )}
      <div className='h-[21px] mt-[13px]'>
        {(!finish && timer) > 0 && (
          <p className='flex justify-center text-timer text-[14px]'>
            {timer} seconds to activate the next step
          </p>
        )}
      </div>
      <Alert
        open={alertOpen}
        setOpen={setAlertOpen}
        text={`You cannot go to the next step, the minimum time for an answer is 
        ${currentScreensInfo[screen]?.minTime} seconds`}
      />
      <Alert
        open={formErrorAlertOpen}
        setOpen={setFormErrorAlertOpen}
        text={
          currentScreensInfo[screen]?.questionType === 'therapy'
            ? 'Please select a rating for therapy'
            : 'Please fill in all fields to continue'
        }
      />
    </>
  );
};

export default ClientForm;
