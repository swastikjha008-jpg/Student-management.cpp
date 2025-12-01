#include <iostream>
#include <fstream>
#include <string>
using namespace std;

struct Student {
    int roll;
    string name;
    string course;
    int age;
};

void saveStudent(const Student &s) {
    ofstream file("students.txt", ios::app);
    if (file) {
        file << s.roll << "|"
             << s.name << "|"
             << s.course << "|"
             << s.age << "\n";
    }
    file.close();
}

void addStudent() {
    Student s;
    cout << "\nEnter Roll Number: ";
    cin >> s.roll;
    cin.ignore();

    cout << "Enter Name: ";
    getline(cin, s.name);

    cout << "Enter Course: ";
    getline(cin, s.course);

    cout << "Enter Age: ";
    cin >> s.age;

    saveStudent(s);
    cout << "✔ Student added successfully!\n";
}

void displayStudents() {
    ifstream file("students.txt");
    if (!file) {
        cout << "No student records found.\n";
        return;
    }

    cout << "\n===== Student Records =====\n";

    string roll, name, course, age;
    while (getline(file, roll, '|') &&
           getline(file, name, '|') &&
           getline(file, course, '|') &&
           getline(file, age)) {

        cout << "Roll: " << roll << "\n";
        cout << "Name: " << name << "\n";
        cout << "Course: " << course << "\n";
        cout << "Age: " << age << "\n";
        cout << "----------------------\n";
    }
    file.close();
}

void searchStudent() {
    int rollToSearch;
    cout << "\nEnter Roll Number to search: ";
    cin >> rollToSearch;

    ifstream file("students.txt");
    if (!file) {
        cout << "No student records found.\n";
        return;
    }

    string roll, name, course, age;
    bool found = false;

    while (getline(file, roll, '|') &&
           getline(file, name, '|') &&
           getline(file, course, '|') &&
           getline(file, age)) {

        if (stoi(roll) == rollToSearch) {
            cout << "\n✔ Student Found!\n";
            cout << "Roll: " << roll << "\n";
            cout << "Name: " << name << "\n";
            cout << "Course: " << course << "\n";
            cout << "Age: " << age << "\n";
            found = true;
            break;
        }
    }

    if (!found)
        cout << "✘ Student not found.\n";

    file.close();
}

void deleteStudent() {
    int rollToDelete;
    cout << "\nEnter Roll to delete: ";
    cin >> rollToDelete;

    ifstream file("students.txt");
    ofstream temp("temp.txt");

    if (!file) {
        cout << "No records!\n";
        return;
    }

    string roll, name, course, age;
    bool deleted = false;

    while (getline(file, roll, '|') &&
           getline(file, name, '|') &&
           getline(file, course, '|') &&
           getline(file, age)) {

        if (stoi(roll) == rollToDelete) {
            deleted = true;
            continue; // skip this student
        }

        temp << roll << "|" << name << "|" << course << "|" << age << "\n";
    }

    file.close();
    temp.close();

    remove("students.txt");
    rename("temp.txt", "students.txt");

    if (deleted)
        cout << "✔ Student deleted successfully.\n";
    else
        cout << "✘ Student not found.\n";
}

void updateStudent() {
    int rollToUpdate;
    cout << "\nEnter Roll to update: ";
    cin >> rollToUpdate;
    cin.ignore();

    ifstream file("students.txt");
    ofstream temp("temp.txt");

    if (!file) {
        cout << "No records!\n";
        return;
    }

    string roll, name, course, age;
    bool updated = false;

    while (getline(file, roll, '|') &&
           getline(file, name, '|') &&
           getline(file, course, '|') &&
           getline(file, age)) {

        if (stoi(roll) == rollToUpdate) {
            updated = true;

            Student s;
            s.roll = stoi(roll);

            cout << "\nEnter new Name: ";
            getline(cin, s.name);

            cout << "Enter new Course: ";
            getline(cin, s.course);

            cout << "Enter new Age: ";
            cin >> s.age;
            cin.ignore();

            temp << s.roll << "|" << s.name << "|" << s.course << "|" << s.age << "\n";
            continue;
        }

        temp << roll << "|" << name << "|" << course << "|" << age << "\n";
    }

    file.close();
    temp.close();

    remove("students.txt");
    rename("temp.txt", "students.txt");

    if (updated)
        cout << "✔ Student updated.\n";
    else
        cout << "✘ Student not found.\n";
}

int main() {
    int choice;

    do {
        cout << "\n===== Student Management System =====\n";
        cout << "1. Add Student\n";
        cout << "2. Display All Students\n";
        cout << "3. Search Student\n";
        cout << "4. Update Student\n";
        cout << "5. Delete Student\n";
        cout << "6. Exit\n";
        cout << "Enter choice: ";
        cin >> choice;
        cin.ignore();

        switch (choice) {
            case 1: addStudent(); break;
            case 2: displayStudents(); break;
            case 3: searchStudent(); break;
            case 4: updateStudent(); break;
            case 5: deleteStudent(); break;
            case 6: cout << "Exiting...\n"; break;
            default: cout << "Invalid option.\n";
        }
    } while (choice != 6);

    return 0;
}

