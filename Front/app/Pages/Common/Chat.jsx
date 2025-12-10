import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

const SChat = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Welcome to the chat!' },
    { id: '2', text: 'Say hi to your classmates!' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      u:true
    };
    setMessages(prev => [newMessage, ...prev]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.chatWrapper}>
            <FlatList
              data={messages}
              keyExtractor={item => item.id}
              inverted
              
                renderItem={({ item }) => {
                  return item.u ? (
                    <View style={styles.messageBubble2}>
                      <Text style={styles.text2}>{item.text}</Text>
                    </View>
                  ) : (
                    <View style={styles.messageBubble}>
                      <Text>{item.text}</Text>
                    </View>
                  );
                }}
                
              
              contentContainerStyle={styles.messagesContainer}
              style={styles.messageList}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.inputContainer}>
    

        
<TextInput
  placeholder="Message..."
  value={input}
  onChangeText={setInput}
  style={styles.input}
  multiline
  textAlignVertical="top"
/>

            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>File</Text>
        </TouchableOpacity>

                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
};

export default SChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"rgb(213, 212, 212)",
    
  },
  inner: {
    flex: 1,
  },
  chatWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messageList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 10,
  },
  messageBubble: {
    backgroundColor:'rgb(244, 242, 242)',
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageBubble2: {
    backgroundColor: '#84234f',
    padding: 10,
    color: 'white',
    marginVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  text2:{color:"rgb(243, 242, 242)"},
inputContainer: {
  flexDirection: 'row',
  alignItems: 'flex-end',
  paddingHorizontal: 3,
  paddingVertical: 10,
  borderTopWidth: 1,
  borderColor: '#ddd',
  backgroundColor:"rgb(214, 213, 214)",
},

input: {
  flex: 1,
  borderRadius: 20,
  borderColor: '#ccc',
  fontSize: 15,
  paddingHorizontal: 12,
  paddingVertical: 8,
  marginRight: 8,
  maxHeight: 120, // allow growth up to ~5 lines
  minHeight: 36,
  overflow: 'scroll',
},


  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    padding:5,
    fontWeight: 'bold',
  },
});
