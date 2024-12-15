import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Employee } from '../models/Employee';

@Injectable()
export class EmployeeService {
    private apiUrl = 'https://retoolapi.dev/HYd96h/data';
    employeesData: Employee[] = [];

    constructor(private http: HttpClient) { }

    getAllEmployees(): Observable<any> {
        if (this.employeesData.length > 0) {
            return of(this.employeesData);
        } else {
            return this.http.get<Employee[]>(`${this.apiUrl}`)
                .pipe(tap(result => { this.employeesData = result }));
        }

    }

    addEmployee(data: any): Observable<any> {
        this.employeesData = [...this.employeesData, data];
        return of(this.employeesData);
    }

    deleteEmployee(id: string): Observable<any> {
        this.employeesData = this.employeesData.filter((employee) => employee.id !== id);
        return of(this.employeesData);
    }

    setEmployeesData(employees: any) {
        this.employeesData = employees;
    }

    generateId() {
        return Math.floor(Math.random() * 1000);
    }


}