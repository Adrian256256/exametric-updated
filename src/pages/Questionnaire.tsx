import { useState, useEffect, useMemo, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FileText, Volume2, Save, RotateCcw, CheckCircle, ChevronLeft, ChevronRight, Mic, Square, Play } from "lucide-react";
import { examData, Question } from "@/data/examQuestions";

interface Answers {
  [sectionId: string]: {
    [questionId: string]: string | { type: 'audio'; url: string; duration: number };
  };
}

interface QuestionWithSection {
  question: Question;
  sectionId: string;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Questionnaire = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  // Shuffle ALL questions together across all sections
  const allShuffledQuestions = useMemo<QuestionWithSection[]>(() => {
    const allQuestions: QuestionWithSection[] = [];
    
    // Collect all questions from all sections
    Object.entries(examData.sets).forEach(([sectionId, section]) => {
      Object.values(section.questions).forEach((question) => {
        allQuestions.push({ question, sectionId });
      });
    });
    
    // Shuffle all questions together
    return shuffleArray(allQuestions);
  }, []);

  // Load saved answers from sessionStorage on mount
  useEffect(() => {
    const savedAnswers = sessionStorage.getItem("examAnswers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  // Text-to-speech function for audio questions
  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive",
      });
    }
  };

  const handleAnswerChange = (sectionId: string, questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [questionId]: value,
      },
    }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Try to use a more compatible audio format
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/mpeg'
      ];
      
      let selectedMimeType = 'audio/webm'; // fallback
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          console.log('Using MIME type:', mimeType);
          break;
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: selectedMimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: selectedMimeType });
        console.log('Audio blob created:', { type: selectedMimeType, size: audioBlob.size });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak your answer now...",
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record your answer.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your audio answer has been recorded.",
      });
    }
  };

  const saveAudioAnswer = async (sectionId: string, questionId: string) => {
    if (audioBlob) {
      // Convert blob to base64 data URL for persistent storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        const audioDuration = 0; // You could calculate this if needed
        
        console.log("Saving audio answer:", { sectionId, questionId, audioLength: base64Audio?.length });
        
        setAnswers((prev) => ({
          ...prev,
          [sectionId]: {
            ...prev[sectionId],
            [questionId]: { type: 'audio', url: base64Audio, duration: audioDuration },
          },
        }));
        
        setAudioBlob(null);
        toast({
          title: "Answer saved",
          description: "Your audio answer has been saved.",
        });
      };
      reader.onerror = () => {
        console.error("Error reading audio blob");
        toast({
          title: "Error",
          description: "Failed to save audio recording.",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(audioBlob);
    }
  };

  const playAudioAnswer = (audioUrl: string) => {
    console.log("Attempting to play audio:", { audioUrl: audioUrl?.substring(0, 100) + "..." });
    
    if (!audioUrl) {
      toast({
        title: "Error",
        description: "No audio recording found.",
        variant: "destructive",
      });
      return;
    }

    const audio = new Audio();
    audio.src = audioUrl;
    
    // Add event listeners for better debugging
    audio.onloadeddata = () => {
      console.log("Audio loaded successfully");
    };
    
    audio.onerror = (e) => {
      console.error("Audio error event:", e);
      console.error("Audio error details:", audio.error);
      toast({
        title: "Playback Error",
        description: "Could not play the audio recording. The audio format may not be supported.",
        variant: "destructive",
      });
    };
    
    audio.play().then(() => {
      console.log("Audio playback started");
      toast({
        title: "Playing Audio",
        description: "Your audio answer is now playing.",
      });
    }).catch((error) => {
      console.error("Error playing audio:", error);
      toast({
        title: "Playback Error",
        description: `Could not play the audio recording: ${error.message}`,
        variant: "destructive",
      });
    });
  };

  const handleSave = () => {
    sessionStorage.setItem("examAnswers", JSON.stringify(answers));
    toast({
      title: "Progress saved!",
      description: "Your answers have been saved successfully.",
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all answers? This action cannot be undone.")) {
      setAnswers({});
      sessionStorage.removeItem("examAnswers");
      toast({
        title: "Answers reset",
        description: "All your answers have been cleared.",
      });
    }
  };

  const getTotalCompletionPercentage = () => {
    const totalQuestions = allShuffledQuestions.length;
    const answeredCount = allShuffledQuestions.filter(({ question, sectionId }) => {
      const answer = answers[sectionId]?.[question.id];
      if (!answer) return false;
      if (typeof answer === 'string') return answer.trim() !== "";
      return answer.type === 'audio' && answer.url;
    }).length;

    return totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  };

  const getCurrentQuestion = () => {
    return allShuffledQuestions[currentQuestionIndex];
  };

  const getTotalQuestions = () => {
    return allShuffledQuestions.length;
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < allShuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isLastQuestion = () => {
    return currentQuestionIndex === allShuffledQuestions.length - 1;
  };

  const isFirstQuestion = () => {
    return currentQuestionIndex === 0;
  };

  const handleFinish = () => {
    handleSave();
    setIsFinished(true);
    toast({
      title: "Questionnaire completed!",
      description: "Thank you for completing the assessment.",
    });
  };

  const handleRestart = () => {
    setIsFinished(false);
    setCurrentQuestionIndex(0);
  };

  const renderQuestion = (questionWithSection: QuestionWithSection) => {
    const { question, sectionId } = questionWithSection;
    const currentAnswer = answers[sectionId]?.[question.id];
    
    const isAnswered = currentAnswer ? 
      (typeof currentAnswer === 'string' ? currentAnswer.trim() !== "" : currentAnswer.type === 'audio') 
      : false;
    
    const totalQuestions = getTotalQuestions();
    const isAudioQuestion = question.type === "audio";
    const hasAudioRecording = currentAnswer && typeof currentAnswer !== 'string' && currentAnswer.type === 'audio';

    return (
      <div className="space-y-6">
        <Card className="shadow-card hover:shadow-elevated transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {isAnswered && (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Answered
                    </Badge>
                  )}
                </div>
                {isAudioQuestion ? (
                  <CardTitle className="text-lg text-muted-foreground italic">
                    Click "Play" to hear the question
                  </CardTitle>
                ) : (
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                )}
              </div>
              {isAudioQuestion && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => speakQuestion(question.tts_text || question.question)}
                  className="ml-4"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Play
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isAudioQuestion ? (
              <div className="space-y-4">
                <Label>Your Audio Answer</Label>
                
                {hasAudioRecording && typeof currentAnswer !== 'string' && (
                  <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Audio answer recorded</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => playAudioAnswer(currentAnswer.url)}
                      className="ml-auto"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play Recording
                    </Button>
                  </div>
                )}

                {audioBlob && !hasAudioRecording && (
                  <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <span className="text-sm">Recording ready to save</span>
                    <Button
                      size="sm"
                      onClick={() => saveAudioAnswer(sectionId, question.id)}
                      className="ml-auto"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Answer
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      variant="default"
                      className="gap-2 bg-red-600 hover:bg-red-700"
                      disabled={!!audioBlob}
                    >
                      <Mic className="h-4 w-4" />
                      {hasAudioRecording ? 'Record Again' : 'Start Recording'}
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="gap-2 animate-pulse"
                    >
                      <Square className="h-4 w-4" />
                      Stop Recording
                    </Button>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  Click the microphone button to record your voice answer to this question.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor={`${sectionId}-${question.id}`}>Your Answer</Label>
                <Textarea
                  id={`${sectionId}-${question.id}`}
                  value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                  onChange={(e) => handleAnswerChange(sectionId, question.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="min-h-[120px]"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            onClick={goToPreviousQuestion}
            disabled={isFirstQuestion()}
            variant="outline"
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground font-medium">
            {/* Progress indicator without question number */}
          </div>

          {isLastQuestion() ? (
            <Button
              onClick={handleFinish}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              Finish
              <CheckCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={goToNextQuestion}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderReviewPage = () => {
    const answeredQuestions = allShuffledQuestions.filter(({ question, sectionId }) => {
      const answer = answers[sectionId]?.[question.id];
      if (!answer) return false;
      if (typeof answer === 'string') return answer.trim() !== "";
      return answer.type === 'audio' && answer.url;
    });

    const unansweredQuestions = allShuffledQuestions.filter(({ question, sectionId }) => {
      const answer = answers[sectionId]?.[question.id];
      if (!answer) return true;
      if (typeof answer === 'string') return answer.trim() === "";
      return !answer.url;
    });

    return (
      <div className="space-y-8">
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              Questionnaire Complete!
            </CardTitle>
            <CardDescription className="text-base">
              You have answered {answeredQuestions.length} out of {allShuffledQuestions.length} questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button onClick={handleRestart} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Take Again
              </Button>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-6">Your Answers Review</h2>
          
          {answeredQuestions.length > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-green-600">Answered Questions ({answeredQuestions.length})</h3>
              {answeredQuestions.map(({ question, sectionId }, index) => (
                <Card key={`answered-${sectionId}-${question.id}`} className="border-green-200 dark:border-green-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Answered
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">
                          {question.question}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg">
                      <Label className="text-sm font-semibold mb-2 block">Your Answer:</Label>
                      {typeof answers[sectionId]?.[question.id] === 'string' ? (
                        <p className="text-sm whitespace-pre-wrap">{answers[sectionId]?.[question.id] as string}</p>
                      ) : answers[sectionId]?.[question.id] && typeof answers[sectionId]?.[question.id] !== 'string' ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => playAudioAnswer((answers[sectionId]?.[question.id] as { type: 'audio'; url: string; duration: number }).url)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Play Audio Answer
                          </Button>
                          <span className="text-sm text-muted-foreground">Audio recording</span>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {unansweredQuestions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-muted-foreground">Unanswered Questions ({unansweredQuestions.length})</h3>
              {unansweredQuestions.map(({ question, sectionId }) => (
                <Card key={`unanswered-${sectionId}-${question.id}`} className="border-muted">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-muted-foreground">
                            Not Answered
                          </Badge>
                        </div>
                        <CardTitle className="text-lg text-muted-foreground">
                          {question.question}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container py-12">
        {isFinished ? (
          renderReviewPage()
        ) : (
          <>
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{examData.title}</h1>
              <p className="text-muted-foreground text-lg mb-6">{examData.description}</p>
              
              <div className="mb-6">
                <Card className="bg-accent/10 border-accent">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Overall Progress</span>
                        <span className="font-bold text-lg">{getTotalCompletionPercentage()}%</span>
                      </div>
                      <Progress value={getTotalCompletionPercentage()} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Progress
                </Button>
                <Button onClick={handleFinish} className="gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Finish Questionnaire
                </Button>
                <Button onClick={handleReset} variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset All
                </Button>
              </div>
            </div>

            {getCurrentQuestion() && renderQuestion(getCurrentQuestion()!)}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Questionnaire;
