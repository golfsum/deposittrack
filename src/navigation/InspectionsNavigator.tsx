import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { InspectionsListScreen } from '@/screens/InspectionsListScreen';
import { NewInspectionScreen } from '@/screens/NewInspectionScreen';
import { InspectionDetailScreen } from '@/screens/InspectionDetailScreen';
import { RoomScreen } from '@/screens/RoomScreen';
import type { InspectionStackParamList } from '@/navigation/types';
import { colors } from '@/theme';

const Stack = createNativeStackNavigator<InspectionStackParamList>();

export function InspectionsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="InspectionsList"
        component={InspectionsListScreen}
        options={{ title: 'Inspections' }}
      />
      <Stack.Screen
        name="NewInspection"
        component={NewInspectionScreen}
        options={{ title: 'New Inspection' }}
      />
      <Stack.Screen
        name="InspectionDetail"
        component={InspectionDetailScreen}
        options={{ title: 'Inspection' }}
      />
      <Stack.Screen name="Room" component={RoomScreen} options={{ title: 'Room' }} />
    </Stack.Navigator>
  );
}
