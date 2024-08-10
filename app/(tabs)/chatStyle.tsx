import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#100947', 
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
    micButton: {
        backgroundColor: 'rgb(7, 25, 187)',
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginRight:10
    },
    circleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    circle: {
        width: 232,
        height: 232,
        borderRadius: 116,
        borderWidth: 27,
        borderColor: 'rgba(30, 136, 197, 0.636)',
        position: 'absolute',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.09)',
        borderRadius: 20,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
        padding: 15,
    },
    sendButton: {
        backgroundColor: 'white',
        borderRadius: 25,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 15,
        borderRadius: 20,
        marginBottom: 15,
        color: '#ffffff',
    },
    messageBubbleText: {
        color: '#ffffff'
    },
    userMessage: {
        backgroundColor: 'rgb(37, 53, 197)',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 0,
        color: '#ffffff',
    },
    assistantMessage: {
        backgroundColor: 'rgba(118, 147, 251, 0.756)',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 0,
        color: '#ffffff',
    },
    messageText: {
        color: '#ffffff',
        fontSize: 14,
    },
    historyButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'rgb(7, 25, 187)',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
    },
    historyButtonText: {
        color: '#ffffff',
        fontSize: 16,
        letterSpacing: 2,
    },
});
