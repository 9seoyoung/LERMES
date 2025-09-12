package com.kdt.KDT_PJT.file.ctl;
import java.time.LocalDate;


public class FileController {
    public static void main(String[] args) {
        String home = System.getProperty("user.home");
        System.out.println("경로 : " + home);
        LocalDate localDate = LocalDate.now();
        System.out.println("localDate = " + localDate);
        String yyyy = "%04d".formatted(LocalDate.now().getYear());
//        System.out.println("yyyy = " + yyyy);
        int currentYear = LocalDate.now().getYear();
//        System.out.println("currentYear = " + currentYear);
        int currentMonth = LocalDate.now().getMonthValue();
//        System.out.println("currentMonth = " + currentMonth);

        String StrMonth = "%02d".formatted(currentMonth);
        System.out.println("StrMonth = " + StrMonth);

        int currentDay = LocalDate.now().getDayOfMonth();
//        System.out.println("currentDay = " + currentDay);
        String StrDay = "%02d".formatted(currentDay);
        System.out.println("StrDay = " + StrDay);




        
    }
}
