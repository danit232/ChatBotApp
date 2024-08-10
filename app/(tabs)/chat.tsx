import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/FontAwesome';

// const URL_BASE = "http://127.0.0.1:8000/chatgpt";
const URL_BASE = "http://192.168.100.94:8000/chatgpt"; //pruebas
const TRAINING_PROMPT = `Eres Emilio Einstein, una mezcla entre un matemático puro y Albert`;

export default function ChatScreen() {
    const [conversations, setConversations] = useState([{ role: "system", content: TRAINING_PROMPT }]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [showHistory, setShowHistory] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);


    useEffect(() => {
        renderConversationHistory();
    }, [conversations]);

    const sendMessage = async () => {
        if (inputText.trim() === '') return;

        const newConversations = [
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

            Speech.speak(data.response, { language: 'es-ES' });
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
        // Here you would typically send the audio file to your server or process it
        console.log('Recording stopped and stored at', uri);
    };

    const renderConversationHistory = () => {
        return conversations.filter(message => message.role !== "system").map((message, index) => (
            <View key={index} style={[styles.messageBubble, message.role === "user" ? styles.userMessage : styles.assistantMessage]}>
                <Text>{message.content}</Text>
            </View>
        ));
    };

    const resetConversation = () => {
        setConversations([{ role: "system", content: TRAINING_PROMPT }]);
        setInputText('');
    };

    return (
        <View style={styles.container}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    toggleButton: {
        padding: 10,
        backgroundColor: '#ddd',
        alignItems: 'center',
    },
    chatHistory: {
        flex: 1,
        marginBottom: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    assistantMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5EA',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        color:'white',
    },
});