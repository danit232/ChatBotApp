import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './chatStyle';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withRepeat, cancelAnimation } from 'react-native-reanimated';

const URL_BASE = "http://192.168.100.94:8000/chatgpt"; // pruebas
const TRAINING_PROMPT = `Eres Emilio Einstein, una mezcla entre un matemático puro y Albert`;

interface Message {
    role: string;
    content: string;
}

export default function ChatScreen() {
    const [conversations, setConversations] = useState<Message[]>([{ role: "system", content: TRAINING_PROMPT }]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [showHistory, setShowHistory] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isAISpeaking, setIsAISpeaking] = useState(false);

    const AnimatedCircle: React.FC<{ isAISpeaking: boolean }> = ({ isAISpeaking }) => {
        const scale = useSharedValue(1);
        const opacity = useSharedValue(1);

        useEffect(() => {
            if (isAISpeaking) {
                scale.value = withRepeat(
                    withTiming(0.8, { duration: 1000 }),
                    -1,
                    true
                );
                opacity.value = withRepeat(
                    withTiming(0.5, { duration: 1000 }),
                    -1,
                    true
                );
            } else {
                cancelAnimation(scale);
                cancelAnimation(opacity);
                scale.value = withTiming(1, { duration: 500 });
                opacity.value = withTiming(1, { duration: 500 });
            }
        }, [isAISpeaking]);

        const animatedStyle = useAnimatedStyle(() => {
            return {
                transform: [{ scale: scale.value }],
                opacity: opacity.value,
            };
        });

        return (
            <Animated.View style={[styles.circle, animatedStyle]} />
        );
    };

    useEffect(() => {
        renderConversationHistory();
    }, [conversations]);

    const sendMessage = async () => {
        if (inputText.trim() === '') return;

        const newConversations: Message[] = [
            ...conversations,
            { role: "user", content: inputText.trim() },
            { role: "assistant", content: "escribiendo..." }
        ];
        setConversations(newConversations);
        setInputText('');

        try {
            const response = await fetch(URL_BASE, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Psico-API-Key': '94705224-bhvg-4745-mac7-f15c455858f4'
                },
                body: JSON.stringify({ messages: newConversations.slice(0, -1) })
            });
            const data = await response.json();

            setConversations(prev => [
                ...prev.slice(0, -1),
                { role: "assistant", content: data.response }
            ]);

            setIsAISpeaking(true);
            Speech.speak(data.response, { 
                language: 'es-ES',
                onDone: () => setIsAISpeaking(false),
                onStopped: () => setIsAISpeaking(false)
            });
        } catch (error) {
            console.error('Error:', error);
            setConversations(prev => [
                ...prev.slice(0, -1),
                { role: "assistant", content: `Error: ${error}` }
            ]);
        }
    };

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        if (!recording) {
            return;
        }

        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        console.log('Recording stopped and stored at', uri);
    };

    const renderConversationHistory = () => {
        return conversations.filter(message => message.role !== "system").map((message, index) => (
            <View key={index} style={[styles.messageBubble, message.role === "user" ? styles.userMessage : styles.assistantMessage]}>
                <Text style={styles.messageBubbleText}>{message.content} </Text>
            </View>
        ));
    };

    const resetConversation = () => {
        setConversations([{ role: "system", content: TRAINING_PROMPT }]);
        setInputText('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.circleContainer}>
                <AnimatedCircle isAISpeaking={isAISpeaking} />
                <AnimatedCircle isAISpeaking={isAISpeaking} />
                <AnimatedCircle isAISpeaking={isAISpeaking} />
            </View>
            <TouchableOpacity onPress={() => setShowHistory(!showHistory)} style={styles.toggleButton}>
                <Text>{showHistory ? 'Hide History' : 'Show History'}</Text>
            </TouchableOpacity>

            {showHistory && (
                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    style={styles.chatHistory}
                >
                    {renderConversationHistory()}
                </ScrollView>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    multiline
                />
                <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
                    <Icon name={isRecording ? "stop-circle" : "microphone"} size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={sendMessage}>
                    <Icon name="paper-plane" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
