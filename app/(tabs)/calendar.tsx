import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Calendar from "../../components/Calendar";

export default function CalendarTab() {
  const handleDateSelect = (date: Date) => {
    console.log('Selected date:', date.toDateString());
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar onDateSelect={handleDateSelect} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
