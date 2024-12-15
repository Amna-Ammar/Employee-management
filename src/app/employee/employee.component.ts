import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { AddEmployeeDialogComponent } from '../add-employee-dialog/add-employee-dialog.component';


@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatToolbarModule
  ],
  providers: [EmployeeService],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {

  displayedColumns: string[] = ['id', 'age', 'dob', 'email', 'salary', 'address', 'lastName', 'firstName', 'contactNumber', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  pageSizeOptions = [5, 10, 20];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private employeeService: EmployeeService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  // Load all employees from the service
  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        console.log(this.paginator)
        if (this.paginator) {
          this.paginator.length = data.length;
          this.dataSource.paginator = this.paginator;
        }

      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Method to handle page change
  changePage(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEmployees();  // Load employees based on new page
  }

  // Method to apply the filter to the table
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();  // Apply filter to the dataSource
  }

  // Method to add an employee
  openAddEmployeeDialog(): void {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent, {
      width: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //this call is needed to refill the local employees variable in the service
        this.employeeService.setEmployeesData(this.dataSource.data);
        // Add the new employee to the data array
        result.id = this.employeeService.generateId();
        this.employeeService.addEmployee(result).subscribe({
          next: (val: any) => {
            this.loadEmployees();
            alert('Employee added successfully!');

          },
          error: (err: any) => {
            console.error(err);
            alert("Error while adding the employee!");
          },
        })

      }
    });
  }
  // Method to delete an employee from the table
  deleteEmployee(id: string): void {
    let confirm = window.confirm("Are you sure you want to delete this employee?");
    if (confirm) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: (res) => {
          alert('Employee deleted!');
          this.loadEmployees();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

  }

}

