import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Modal, LogBox, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';

LogBox.ignoreAllLogs();

export default function App() {
  const [type, setType] = useState(RNCamera.Constants.Type.back);
  const [open, setOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  
  async function takePicture(camera){
    setOpen(true);

    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      console.log(data.uri);

      setCapturedPhoto(data.uri);
    }
  }

  function toggleCam(){
    setType(type === RNCamera.Constants.Type.front ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front);
  }

  return(
    <View style={styles.container}>

      <RNCamera
      style={styles.preview}
      type={type}
      flashMode={RNCamera.Constants.FlashMode.auto}
      androidCameraPermissionOptions={{
        title: 'Permissão para usar câmera',
        message: 'Você autoriza o app a utilizar a câmera?',
        buttonPositive: 'Sim',
        buttonNegative: 'Não',
      }}
      androidRecordAudioPermissionOptions={{
        title: 'Permissão para gravar áudio',
        message: 'Você autoriza o app a utilizar a gravação de áudio?',
        buttonPositive: 'Sim',
        buttonNegative: 'Não',
      }}
      >
        { ({ camera, status, recordAudioPermissionStatus }) => {
          if (status !== 'READY') return <View />;
          return (
            <View style={{marginBottom: 35, flexDirection: 'row', alignItems:'flex-end', justifyContent:'space-between'}}
            >
              <TouchableOpacity
              onPress={() => takePicture(camera) }
              style={styles.capture}
              >
                <Text>Tirar Foto</Text>
              </TouchableOpacity>
             
              <TouchableOpacity
              onPress={() => {}}
              style={styles.capture}
              >
                <Text>Álbum</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>

      <View style={styles.camPosition}>
        <TouchableOpacity onPress={toggleCam}>
          <Text>Inverter</Text>
        </TouchableOpacity>
      </View>

      { capturedPhoto &&

        <Modal animationType='slide' transparent={false} visible={open}>
          <View style={{ flex:1, justifyContent:'center', margin:20 }}>
            <TouchableOpacity 
            style={{margin:10,}}
            onPress={() => setOpen(false) }
            >
              <Text style={styles.fechar}>Fechar</Text>
              <Image 
              style={{with:350, height:450, borderRadius: 15, resizeMode: 'contain'}}
              source={{uri: capturedPhoto}}
              />
            </TouchableOpacity>
          </View>
        </Modal>

      }

      <StatusBar hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  fechar: {
    fontSize:20,
  },
  camPosition: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    height: 40,
    position: 'absolute',
    right: 25,
    top: 60,
  },
});