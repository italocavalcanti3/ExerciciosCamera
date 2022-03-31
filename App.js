import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Modal, LogBox, Image, PermissionsAndroid, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

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
      savePicture(data.uri);
    }
  }

  function toggleCam(){
    setType(type === RNCamera.Constants.Type.front ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front);
  }

  function openAlbum() {
    const options = { 
      title: 'Selecione uma foto',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      saveToPhotos: true,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Abertura de álbum cancelado');
      } else if (response.errorCode){
        console.log('Deu erro: ' + response.errorCode);
      } else {
        setOpen(true);
        setCapturedPhoto(response.assets[0].uri);

      }
    });
  }

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }
  
  async function savePicture(data) {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }
      CameraRoll.save(data, 'photo')
      .then((res) => {
        console.log('Salvo com sucesso: ' + res)
      })
      .catch((e) => console.log('Erro ao salvar: ' + e.code + ' - ' + e.message));
  };

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
              onPress={openAlbum}
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
              style={{width:350, height:450, borderRadius: 15, resizeMode: 'contain'}}
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