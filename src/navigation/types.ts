import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type InspectionStackParamList = {
  InspectionsList: undefined;
  NewInspection: undefined;
  InspectionDetail: { id: string };
  Room: { inspectionId: string; roomId: string };
};

export type InspectionStackScreen<T extends keyof InspectionStackParamList> =
  NativeStackScreenProps<InspectionStackParamList, T>;
